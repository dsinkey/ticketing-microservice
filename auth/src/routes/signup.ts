import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/users';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middelwares/validate-request';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be 4 to 20 characters long'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    // Generate JWT
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY is not defined');
    }
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // ! is to tell TypeScript that this variable is defined
    );

    // Store it on seesion object
    req.session = {
      jwt: userJWT,
    };

    await user.save();

    res.status(201).send(user);
  }
);

export { router as signupRouter };

import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@ds-tickets/common';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    // const { title, price } = req.body;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };

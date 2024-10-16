import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import Resource from '../../../models/Resource';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const resources = await Resource.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: resources });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const resource = await Resource.create(req.body);
        res.status(201).json({ success: true, data: resource });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import Resource from '../../../models/Resource';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const resource = await Resource.findById(id);
        if (!resource) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: resource });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'PUT':
      try {
        const resource = await Resource.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!resource) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: resource });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'DELETE':
      try {
        const deletedResource = await Resource.deleteOne({ _id: id });
        if (!deletedResource) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
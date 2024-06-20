import { AuthFailureError, BadRequestError, NotFoundError } from '../core/error.response.js'
import { User } from '../models/user.model.js'
import Movement from '../models/movement.model.js'

class MovementService{
  static createMovement = async(adminId, body) => {
    //1. Check if admin exists
    const admin = await User.findById(adminId)
    if (!admin) {
      throw new AuthFailureError('Admin not found')
    }

    //2. Create movement
    const movement = new Movement({
      title: body.title,
      thumbnail: body.thumbnail
    })

    await movement.save()
    return {
      movement
    }
  }

  static readMovements = async () => {
    const movements = await Movement.aggregate([
      {
        $lookup: {
          from: 'Artworks',
          localField: '_id',
          foreignField: 'movements',
          as: 'artworks'
        }
      },
      {
        $addFields: {
          artworkCount: { $size: '$artworks' }
        }
      },
      {
        $project: {
          artworks: 0 // Exclude the artworks array to reduce payload size
        }
      }
    ])

    if (!movements || movements.length === 0) {
      throw new NotFoundError('Movements not found')
    }

    return movements
  }

  static updateMovement = async(adminId, movementId, body) => {
    //1. Check if admin and movement exists
    const admin = await User.findById(adminId)
    const movement = await Movement.findById(movementId)
    if (!admin) {
      throw new AuthFailureError('Admin not found')
    }
    if (!movement) {
      throw new BadRequestError('Movement not found')
    }

    //2. Update movement
    movement.title = body.title
    movement.thumbnail = body.thumbnail
    await movement.save()

    return {
      movement
    }
  }   

  static deleteMovement = async(adminId, movementId) => {
    //1. Check if admin and movement exists
    const admin = await User.findById(adminId)
    const movement = await Movement.findById(movementId)
    if (!admin) {
      throw new AuthFailureError('Admin not found')
    }
    if (!movement) {
      throw new BadRequestError('Movement not found')
    }

    //2. Delete movement
    await movement.deleteOne()

    return {
      message: 'Movement deleted'
    }
  }
}

export default MovementService

import { NotFoundError, UnAuthorizedError } from '../errors/error.js'
import Listing from '../models/listing.model.js'

export default class ListingController {
  static async createListing(req, res) {
    const listing = await Listing.create(req.body)
    res.status(201).json({
      status: 'Success',
      message: 'Listing created successfully',
      listing,
    })
  }

  static async getUserListings(req, res) {
    const id = req.params.id
    const userId = req.user._id
    if (id !== userId)
      throw new UnAuthorizedError('You are not authorized to access this route')
    //   if (!Types.ObjectId.isValid(id)) throw new BadUserRequestError('Please pass a valid product ID')
    const listings = await Listing.find({ userRef: userId })
    if (listings.length < 0) throw new NotFoundError('No listing available')
    res.status(200).json({
      status: 'Success',
      message: `${listings.length} listings available`,
      listings,
    })
  }

  static async deleteListing(req, res) {
    const id = req.params.id
    const userId = req.user._id
    const listing = await Listing.findById(id)
    if (!listing) throw new NotFoundError('Listing not found')
    if (userId !== listing.userRef)
      throw new UnAuthorizedError('You can only delete your own listings!')
    await Listing.findByIdAndDelete(id)
    res.status(200).json({
      status: 'Success',
      message: 'Listing deleted successfully!',
    })
  }

  static async updateListing(req, res) {
    const id = req.params.id
    const userId = req.user._id
    const listing = await Listing.findById(id)
    if (!listing) throw new NotFoundError('Listing not found')
    if (userId !== listing.userRef)
      throw new UnAuthorizedError('You can only update your own listings!')
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    res.status(200).json({
      status: 'Success',
      message: 'Listing updated successfully!',
      updatedListing,
    })
  }

  static async getListing(req, res) {
    const id = req.params.id
    const listing = await Listing.findById(id)
    if (!listing) throw new NotFoundError('Listing not found')
    res.status(200).json({
      status: 'Success',
      listing,
    })
  }

  static async getListings(req, res) {
    const limit = parseInt(req.query.limit) || 9
    const startIndex = parseInt(req.query.startIndex) || 0
    let offer = req.query.offer

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] }
    }

    let furnished = req.query.furnished

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] }
    }

    let parking = req.query.parking

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] }
    }

    let type = req.query.type

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] }
    }

    const searchTerm = req.query.searchTerm || ''

    const sort = req.query.sort || 'createdAt'

    const order = req.query.order || 'desc'

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex)
    if (!listings) throw new NotFoundError('No listings found')
    res.status(200).json({
      status: 'Success',
      listings,
    })
  }
}

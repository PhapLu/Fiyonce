import { BadRequestError, NotFoundError } from "../core/error.response.js";
import Artwork from "../models/artwork.model.js";
import { findAllArtworks, updateArtworkById, findArtwork, searchArtworksByUser, deleteArtwork } from "../models/repositories/artwork.repo.js";
import { User } from "../models/user.model.js";
import { removeUndefinedObject, updatedNestedObjectParser } from "../utils/index.js";

class ArtworkService{
    
}

export default ArtworkService

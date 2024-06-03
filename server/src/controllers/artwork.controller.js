import ArtworkService from "../services/artwork.service.js";
import { SuccessResponse } from "../core/success.response.js";

class ArtworkController{
    createArtwork = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Create new Artwork success!',
            metadata: await ArtworkService.createArtwork(req.body.artwork_type, {
                ...req.body,
                artwork_talent: req.userId
            })
        }).send(res)
    }

    updateArtwork = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Update Artwork success!',
            metadata: await ArtworkService.updateArtwork(
                req.body.artwork_type,
                req.params.artworkId,
                {
                    ...req.body,
                    artwork_talent: req.userId
                })
        }).send(res)
    }

    likeArtwork = async(req, res, next) => {
        new SuccessResponse({
            message: 'Like an artwork success!',
            metadata: await ArtworkService.likeArtwork(req.userId, req.params.artworkId)
        }).send(res)
    }

    //Query////////
    findAllArtworks = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Find all Artworks success!',
            metadata: await ArtworkService.findAllArtworks(req.query)
        }).send(res)
    }
    searchArtworksByUser = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list Artworks success!',
            metadata: await ArtworkService.searchArtworksByUser(req.params)
        }).send(res)
    }
    findArtwork = async(req, res, next) => {
        new SuccessResponse({
            message: 'Find an Artwork success!',
            metadata: await ArtworkService.findArtwork({
                artwork_id: req.params.artworkId
            })
        }).send(res)
    }
    deleteArtwork = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete an Artwork success!',
            metadata: await ArtworkService.deleteArtwork({
                artwork_id: req.params.artworkId
            })
        }).send(res)
    }

}

export default new ArtworkController()
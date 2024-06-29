import ArtworkService from "../services/artwork.service.js"
import { SuccessResponse } from "../core/success.response.js"

class ArtworkController{
    ///CRUD////////
    createArtwork = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Create new Artwork success!',
            metadata: await ArtworkService.createArtwork(req.userId, req)
        }).send(res)
    }
    
    readArtwork = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get an artwork success!',
            metadata: await ArtworkService.readArtwork(req.params.artworkId)
        }).send(res)
    }

    readArtworksOfTalent = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list artworks success!',
            metadata: await ArtworkService.readArtworksOfTalent(req.params.talentId)
        }).send(res)
    }
    
    updateArtwork = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Update artwork success!',
            metadata: await ArtworkService.updateArtwork(req.userId, req.params.artworkId, req)
        }).send(res)
    }

    deleteArtwork = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete an artwork success!',
            metadata: await ArtworkService.deleteArtwork(req.userId, req.params.artworkId)
        }).send(res)
    }
    ///END----CRUD////////

    likeArtwork = async(req, res, next) => {
        new SuccessResponse({
            message: 'Like an artwork success!',
            metadata: await ArtworkService.likeArtwork(req.userId, req.params.artworkId)
        }).send(res)
    }

    //Query////////
    findAllArtworks = async(req, res, next) =>{
        new SuccessResponse({
            message: 'Find all artworks success!',
            metadata: await ArtworkService.findAllArtworks(req.query)
        }).send(res)
    }

    findArtwork = async(req, res, next) => {
        new SuccessResponse({
            message: 'Find an artwork success!',
            metadata: await ArtworkService.findArtwork()
        }).send(res)
    }
    
}

export default new ArtworkController()
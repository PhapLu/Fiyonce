import { BadRequestError, NotFoundError } from "../core/error.response.js";
import { artwork, showcasing } from "../models/artwork.model.js";
import { findAllArtworks, updateArtworkById, findArtwork, searchArtworksByUser, deleteArtwork } from "../models/repositories/artwork.repo.js";
import { User } from "../models/user.model.js";
import { removeUndefinedObject, updatedNestedObjectParser } from "../utils/index.js";

class ArtworkFactory{
    static artworkRegistry = {}

    static registerArtworkType(type, classRef){
        ArtworkFactory.artworkRegistry[type] = classRef
    }

    static async createArtwork(type, payload){
        const artworkClass = ArtworkFactory.artworkRegistry[type]
        if(artworkClass)
            throw new BadRequestError(`Invalid Artwork Type ${type}`)
        return new artworkClass(payload).createArtwork();
    }
    static async updateArtwork(type, artworkId, payload) {
        const artworkClass = ArtworkFactory.artworkRegistry[type];
        if (!artworkClass)
          throw new BadRequestError(`Invalid artwork Types ${type}`);
        return new artworkClass(payload).updateArtwork(artworkId);
      }
    
    static async findAllArtworks({
        limit = 50,
        sort = "ctime",
        page = 1,
    }) {
        return await findAllArtworks({
          limit,
          sort,
          page,
          select: ["artwork_title", "artwork_attributes", "artwork_description"],
        });
    }
    
    static async findArtwork({ artwork_id }) {
        return await findArtwork({ artwork_id, unSelect: ["__v"] });
    }

    static async searchArtworksByUser({ keySearch }) {
        return await searchArtworksByUser({ keySearch });
    }
    static async deleteArtwork({artwork_id}) {
        return await deleteArtwork({artwork_id})
    }

}

class Artwork{
    constructor({
        artwork_title,
        artwork_thumb,
        artwork_images,
        artwork_description,
        artwork_type,
        artwork_talent,
        artwork_attributes,
    }) {
        (this.artwork_title = artwork_title),
        (this.artwork_thumb = artwork_thumb),
        (this.artwork_images = artwork_images),
        (this.artwork_description = artwork_description),
        (this.artwork_type = artwork_type),
        (this.artwork_talent = artwork_talent),
        (this.artwork_attributes = artwork_attributes);
    }
    //Create New Artwork
    async createArtwork(artworkId){
        const newArtwork = await artwork.create({ ...this, _id: artworkId})
        return newArtwork
    }

    //Update Artwork
    async updateArtwork ({artworkId, payload}){
        return await updateArtworkById({ artworkId, payload, model: artwork });
    }
}
// class ForSellingArtwork extends Artwork{
//     async createArtwork(){
//         const newForSelling = await forSelling.create({
//             ...this.artwork_attributes,
//             artwork_talent: this.artwork_talent,
//         })
//         if (!newForSelling) throw new BadRequestError("Create new ForSelling error");

//         const newArtwork = await super.createProduct(newForSelling._id);
//         if (!newArtwork) throw new BadRequestError("Create new Artwork error");

//         return newArtwork;
//     }

//     async updateArtwork(artworkId){
//         const objectParams = removeUndefinedObject(this)
//         if(objectParams.artwork_attributes){
//             //Update Child
//             await updateArtworkById({
//                 artworkId,
//                 payload: updatedNestedObjectParser(objectParams.artwork_attributes),
//                 model: forSelling
//             })
//         }
//         const updatedArtwork = await super.updateArtwork({
//             artworkId,
//             payload: updatedNestedObjectParser(objectParams)
//         })
//         return updatedArtwork
//     }
// }

class ShowcasingArtwork extends Artwork{
    async createArtwork(){
        const newShowcasing = await showcasing.create({
            ...this.artwork_attributes,
            artwork_talent: this.artwork_talent,
        })
        if (!newShowcasing) throw new BadRequestError("Create new Showcasing error");

        const newArtwork = await super.createProduct(newShowcasing._id);
        if (!newArtwork) throw new BadRequestError("Create new Artwork error");

        return newArtwork;
    }

    async updateArtwork(artworkId){
        const objectParams = removeUndefinedObject(this)
        if(objectParams.artwork_attributes){
            //Update Child
            await updateArtworkById({
                artworkId,
                payload: updatedNestedObjectParser(objectParams.artwork_attributes),
                model: showcasing
            })
        }
        const updatedArtwork = await super.updateArtwork({
            artworkId,
            payload: updatedNestedObjectParser(objectParams)
        })
        return updatedArtwork
    }
}

// ArtworkFactory.registerArtworkType("ForSelling", ForSellingArtwork)
ArtworkFactory.registerArtworkType("Showcasing", ShowcasingArtwork)

export default ArtworkFactory


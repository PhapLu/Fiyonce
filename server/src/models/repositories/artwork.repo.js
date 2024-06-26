import { getSelectData, unGetSelectData } from "../../utils/index.js";
import Artwork from "../artwork.model.js";

const updateArtworkById = async({artworkId, payload, model, isNew = true}) =>{
    return  await model.findByIdAndUpdate(artworkId, payload, {new: isNew})
}
const findAllArtworks = async({limit, sort, page, select}) => {
    const skip = (page -1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const artworks = await Artwork.find()
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean()
    return artworks
}

const findArtwork = async({artwork_id, unSelect}) => {
    return await Artwork.findById(artwork_id).select(unGetSelectData((unSelect)))
}

const searchArtworksByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const result = await Artwork
      .find(
        {
          //isPublished: true,
          $text: { $search: regexSearch },
        },
        {
          score: { $meta: "textScore" },
        }
      )
      .sort({ score: { $meta: "textScore" } })
      .lean();
    return result
};

const deleteArtwork = async ({artwork_id}) => {
    return await Artwork.findByIdAndDelete(artwork_id)
}

export { updateArtworkById, findAllArtworks, findArtwork, searchArtworksByUser, deleteArtwork }
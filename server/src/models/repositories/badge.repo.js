import Service from "../commissionService.model.js"
import Post from "../post.model.js"

const checkEarlyBirdAchievable = async (user) => {
    let achievable = false
    return achievable
}

const checkTrustedArtistAchievable = async (user) => {
    let achievable = false
    const posts = await Post.find({ talentId: user._id})
    const services = await Service.find({ talentId: user._id})
    if(user.bio !== '' &&
            user.taxCode !== '' &&
            user.taxCode.isVerified == true &&
            user.cccd !== '' &&
            !user.avatar.includes('pastal_system_default') &&
            !user.bg.includes('pastal_system_default' &&
            posts.length >= 1 &&
            services.length >= 1)) {
        achievable = true
    }

    return achievable
}

const checkAmbassadorAchievable = async (user) => {
    let achievable = false
    if(user.referral.referred.length >= 10) {
        achievable = true
    }
    return achievable
}

export {checkEarlyBirdAchievable, checkAmbassadorAchievable, checkTrustedArtistAchievable}

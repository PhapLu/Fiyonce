import Service from "../commissionService.model.js"
import Post from "../post.model.js"
import Order from "../order.model.js"
import Review from "../review.model.js"

const checkEarlyBirdAchievable = async (user) => {
    let achievable = true
    return achievable
}

const checkFresherArtistAchievable = async (user) => {
    const minimumFiveStarOrderCount = 1;

    //1: Find all orders where the user is the chosen talent
    const orders = await Order.find({ talentChosenId: user._id }).select('_id');

    //2: Get all reviews for these orders with a 5-star rating
    const reviews = await Review.find({
        orderId: { $in: orders.map(order => order._id) },
        rating: 5
    });

    //3: Check if the user has at least the minimum number of 5-star rated orders
    const achievable = reviews.length >= minimumFiveStarOrderCount;

    return achievable;
};

const checkJuniorArtistAchievable = async (user) => {
    const minimumFiveStarOrderCount = 5

    //1: Find all orders where the user is the chosen talent
    const orders = await Order.find({ talentChosenId: user._id }).select('_id');

    //2: Get all reviews for these orders with a 5-star rating
    const reviews = await Review.find({
        orderId: { $in: orders.map(order => order._id) },
        rating: 5
    });

    //3: Check if the user has at least the minimum number of 5-star rated orders
    const achievable = reviews.length >= minimumFiveStarOrderCount;

    return achievable;
};

const checkSeniorArtistAchievable = async (user) => {
    const minimumFiveStarOrderCount = 20

    //1: Find all orders where the user is the chosen talent
    const orders = await Order.find({ talentChosenId: user._id }).select('_id');

    //2: Get all reviews for these orders with a 5-star rating
    const reviews = await Review.find({
        orderId: { $in: orders.map(order => order._id) },
        rating: 5
    });

    //3: Check if the user has at least the minimum number of 5-star rated orders
    const achievable = reviews.length >= minimumFiveStarOrderCount;

    return achievable;
};

const checkTrustedArtistAchievable = async (user) => {
    let achievable = false
    const posts = await Post.find({ talentId: user._id })
    const services = await Service.find({ talentId: user._id })
    if (user.bio !== '' &&
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

const checkCommunityBuilderAchievable = async (user) => {
    let achievable = false
    if (user.referral.referred.length >= 10) {
        achievable = true
    }
    return achievable
}

const checkAmbassadorAchievable = async (user) => {
    let achievable = false
    if (user.referral.referred.length >= 50) {
        achievable = true
    }
    return achievable
}

const checkRisingStarAchievable = async (user) => {
    let achievable = false
    if (user.followers.length >= 100) {
        achievable = true
    }

    return achievable
}

const checkSuperStarAchievable = async (user) => {
    let achievable = false
    if (user.followers.length >= 500) {
        achievable = true
    }

    return achievable
}

export {
    checkEarlyBirdAchievable,
    checkAmbassadorAchievable,
    checkTrustedArtistAchievable,
    checkRisingStarAchievable,
    checkSuperStarAchievable,
    checkCommunityBuilderAchievable,
    checkFresherArtistAchievable,
    checkJuniorArtistAchievable,
    checkSeniorArtistAchievable
}

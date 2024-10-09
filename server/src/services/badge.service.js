import { User } from "../models/user.model.js"
import {
    AuthFailureError,
    BadRequestError,
    NotFoundError,
} from "../core/error.response.js"
import { checkAmbassadorAchievable, 
    checkEarlyBirdAchievable, 
    checkRisingStarAchievable, 
    checkTrustedArtistAchievable,
    checkCommunityBuilderAchievable,
    checkFresherArtistAchievable,
    checkSeniorArtistAchievable,
    checkJuniorArtistAchievable,
    checkSuperStarAchievable
} from "../models/repositories/badge.repo.js"

class BadgeService {
    static readBadge = async (userId, badgeKey) => {
        // 1. Check user
        const user = await User.findById(userId);
        if (!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này");
    
        // 2. Check if badge is achievable
        let achievable = false;
        switch(badgeKey) {
            case "earlyBird":
                achievable = await checkEarlyBirdAchievable(user);
                break;
            case "trustedArtist":
                achievable = await checkTrustedArtistAchievable(user);
                break;
            case "communityBuilder":
                achievable = await checkCommunityBuilderAchievable(user);
                break;
            case "fresherArtist":
                achievable = await checkFresherArtistAchievable(user);
                break;
            case "risingStar":
                achievable = await checkRisingStarAchievable(user);
                break;
            case "platformAmbassador":
                achievable = await checkAmbassadorAchievable(user);
                break;
            case "juniorArtist":
                achievable = await checkJuniorArtistAchievable(user);
                break;
            case "superStar":
                achievable = await checkSuperStarAchievable(user);
                break;
            case "seniorArtist":
                achievable = await checkSeniorArtistAchievable(user);
                break;
            default:
                throw new BadRequestError("Có lỗi xảy ra");
        }
        
        // 3. Check if badge is already awarded
        const badgeIndex = user.badges.findIndex(badge => badge === badgeKey);
        const claimable = achievable && badgeIndex === -1;

        return {
            claimable
        };
    }      

    static awardBadge = async (userId, badgeKey) => {
        //1. Check user
        const user = await User.findById(userId)
        if(!user) throw new NotFoundError("Bạn cần đăng nhập để thực hiện thao tác này")

        let achievable = false;
        switch(badgeKey) {
            case "earlyBird":
                achievable = await checkEarlyBirdAchievable(user);
                break;
            case "trustedArtist":
                achievable = await checkTrustedArtistAchievable(user);
                break;
            case "communityBuilder":
                achievable = await checkCommunityBuilderAchievable(user);
                break;
            case "fresherArtist":
                achievable = await checkFresherArtistAchievable(user);
                break;
            case "risingStar":
                achievable = await checkRisingStarAchievable(user);
                break;
            case "platformAmbassador":
                achievable = await checkAmbassadorAchievable(user);
                break;
            case "juniorArtist":
                achievable = await checkJuniorArtistAchievable(user);
                break;
            case "superStar":
                achievable = await checkSuperStarAchievable(user);
                break;
            case "seniorArtist":
                achievable = await checkSeniorArtistAchievable(user);
                break;
            default:
                throw new BadRequestError("Có lỗi xảy ra");
        }
        if(!achievable) throw new BadRequestError("Bạn chưa đủ điều kiện để nhận huy hiệu này")

        //3. Check if badge is already awarded
        const badgeIndex = user.badges.findIndex(badge => badge === badgeKey)
        if(badgeIndex !== -1) throw new BadRequestError("Bạn đã nhận huy hiệu này rồi")

        //4. Award the badge
        user.badges.push(badgeKey)
        await user.save()

        return {
            message: "Nhận huy hiệu thành công"
        }
    }
}

export default BadgeService

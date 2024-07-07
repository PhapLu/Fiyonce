// Imports
import {useState} from "react";

// Resources
import Posts from "../../components/crudPost/render/RenderPosts";

// Styling

export default function ExplorePosts() {
    const [posts, setPosts] = useState([
        {
            _id: "1",
            media: [
                "https://i.pinimg.com/236x/c9/33/5b/c9335be944756f57311179e16e463a96.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "1",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "2",
            media: [
                "https://i.pinimg.com/236x/e9/7f/44/e97f44573df1dd4ae1f9f1bbff9be71f.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "2",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "3",
            media: [
                "https://i.pinimg.com/236x/2b/97/3a/2b973a795a718f2193c18e0be888f7ef.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "3",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "4",
            media: [
                "https://i.pinimg.com/474x/22/39/24/223924bd54baf7cf19727ea031204da4.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "4",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "5",
            media: [
                "https://i.pinimg.com/564x/4c/61/4f/4c614f6e646df3868e5df3fa16d71d71.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "5",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "6",
            media: [
                "https://i.pinimg.com/236x/bc/d3/3f/bcd33f453decc45b7777be8e7d04d8bc.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "6",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "7",
            media: [
                "https://i.pinimg.com/236x/c1/d3/d3/c1d3d3c242105537d2574089a200bb0e.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "7",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "8",
            media: [
                "https://i.pinimg.com/236x/7a/9c/58/7a9c58474802d8c98ad22166c4dd2930.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "8",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "9",
            media: [
                "https://i.pinimg.com/736x/3d/f2/69/3df269fe2194150b4fa5828ba6b343a6.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "9",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        },
        {
            _id: "10",
            media: [
                "https://i.pinimg.com/236x/aa/7c/c7/aa7cc774ab7c063ac183ed62e1332213.jpg",
                "https://media0.giphy.com/media/FB6LGdDPkY2ShpoX8N/200.webp?cid=790b76115p8o5xnyzs2y317w0fkqd2yl30qym6j66r1t8g81&ep=v1_gifs_trending&rid=200.webp&ct=g",
            ],
            talentId: "10",
            talentUsername: "nhatluuquoc03",
            talentAvatar: "https://i.pinimg.com/564x/55/88/e4/5588e4170e71b5b3b65dce923d04c5cf.jpg",
            viewCount: 3600
        }
    ]);

    return (
        <Posts layout={5} posts={posts}/>
    )
}
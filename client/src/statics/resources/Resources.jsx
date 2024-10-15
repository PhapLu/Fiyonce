import { Link } from "react-router-dom"
import "./Resources.scss"
import BrandingLogo1 from "../../assets/img/logo.png";

export default function Resources() {
    return (
        <div className="resources">
            <h1 className="flex-align-center flex-justify-center">Tài nguyên trên Pastal</h1>


            <div className="color-palette">
                <div className="color-palette--left">
                    <div className="color-palette-container">
                        <div className="color-palette-item">
                            <div className="color-palette-item__color black"></div>
                            <div className="color-palette-item__desc">
                                <span className="color-palette-item__desc__title">Đen thui</span>
                                <div className="flex-align-center">
                                    <span className="color-palette-item__desc__sub-title">#09090B</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 sm ml-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                    </svg>
                                </div>

                            </div>
                        </div>
                        <div className="color-palette-item">
                            <div className="color-palette-item__color gray"></div>
                            <div className="color-palette-item__desc">
                                <span className="color-palette-item__desc__title">Xám quên đii</span>
                                <div className="flex-align-center">
                                    <span className="color-palette-item__desc__sub-title">#09090B</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 sm ml-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="color-palette-item">
                            <div className="color-palette-item__color purple"></div>
                            <div className="color-palette-item__desc">
                                <span className="color-palette-item__desc__title">Tím mộng merr</span>
                                <div className="flex-align-center">
                                    <span className="color-palette-item__desc__sub-title">#09090B</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 sm ml-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                    </svg>
                                </div>

                            </div>
                        </div>
                        <div className="color-palette-item">
                            <div className="color-palette-item__color yellow"></div>
                            <div className="color-palette-item__desc">
                                <span className="color-palette-item__desc__title">Vàng kim</span>
                                <div className="flex-align-center">
                                    <span className="color-palette-item__desc__sub-title">#09090B</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 sm ml-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                    </svg>
                                </div>

                            </div>
                        </div>
                        <div className="color-palette-item">
                            <div className="color-palette-item__color pink"></div>
                            <div className="color-palette-item__desc">
                                <span className="color-palette-item__desc__title">Hồng hàoo</span>
                                <div className="flex-align-center">
                                    <span className="color-palette-item__desc__sub-title">#09090B</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 sm ml-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                    </svg>
                                </div>

                            </div>
                        </div>
                        <div className="color-palette-item">
                            <div className="color-palette-item__color green"></div>
                            <div className="color-palette-item__desc">
                                <span className="color-palette-item__desc__title">Xanh ngátt</span>
                                <div className="flex-align-center">
                                    <span className="color-palette-item__desc__sub-title">#09090B</span> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 sm ml-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                    </svg>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="color-palette--right">
                    <h2 className="text-align-center">Bộ màu sắc tạo nên Pastal</h2>
                    <p>Màu sắc chính là phương tiện để Pastal truyền tải giá trị nghệ thuật đến với cộng đồng những bạn yêu nghệ thuật nói chung và người làm công việc sáng tạo nói riêng. Mỗi mã màu trên Pastal đều được chọn lọc kĩ lưỡng nhằm mang đến một tổ hợp màu sắc riêng biệt, thể hiện tinh thần tự do sáng tạo của một thế hệ họa sĩ trẻ đầy tài năng và nhiệt huyết.</p>
                </div>
            </div>
            <br />
            <br />
            <br />
            <div className="branding">
                <h2 className="text-align-center">Bộ nhận diện thương hiệu</h2>

                <div className="branding-container">
                    <div className="branding-item">
                        <img src={BrandingLogo1} alt="" />
                        <br />
                        <h4>Logo Pastal</h4>
                        <p>Chữ “P” trong Passionate đại diện cho sự nhiệt huyết của các họa sĩ trẻ trên hành trình theo đuổi đam mê nghệ thật của mình.</p>
                    </div>

                    <div className="branding-item">
                        <img src={BrandingLogo1} alt="" />
                        <br />
                        <h4>Logo Pastal (Tên đầy đủ)</h4>
                        <p>Chữ “P” trong Passionate đại diện cho sự nhiệt huyết của các họa sĩ trẻ trên hành trình theo đuổi đam mê nghệ thật của mình.</p>
                    </div>

                    <div className="branding-item">
                        <img src={BrandingLogo1} alt="" />
                        <br />
                        <h4>Logo Pastal (Tên đầy đủ)</h4>
                        <p>Chữ “P” trong Passionate đại diện cho sự nhiệt huyết của các họa sĩ trẻ trên hành trình theo đuổi đam mê nghệ thật của mình.</p>
                    </div>
                </div>
            </div>

            <br />
            <br />
            <br />

            <h3 className="note text-align-center">
                Các tài nguyên tại đây đều thuộc sở hữu trí tuệ của Pastal và có thể sử dụng công khai cho các hoạt động phi thương mại.
            </h3>
            <br />
            <br />
            <br />
            <hr />
        </div>
    )
}
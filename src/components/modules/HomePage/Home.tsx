"use client"

import About from "./aboutus";
import Banner from "./banner";
import Features from "./Features";
import HowItWork from "./howitwork";
import FeedBack from "./feedback";
import Footer from "./footer";

const Home = () => {
    return (
        <div>
            <Banner />
            <Features/>
            <HowItWork />
            <About/>
            <FeedBack />
            <Footer/>
        </div>
    );
};

export default Home;
"use client"

import About from "./aboutus";
import Banner from "./banner";
import Features from "./Features";
import HowItWork from "./howitwork";
import FeedBack from "./feedback";

const Home = () => {
    return (
        <div>
            <Banner />
            <Features/>
            <HowItWork />
            <About/>
            <FeedBack />
        </div>
    );
};

export default Home;
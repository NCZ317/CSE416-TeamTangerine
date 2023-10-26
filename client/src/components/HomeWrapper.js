import AppBanner from "./AppBanner";
import MapCard from "./MapCard";
import MapWrapper from "./MapWrapper";

export default function HomeWrapper() {
    return (
            <div>
                <AppBanner />
                <MapCard />
                <MapWrapper/>
            </div>
        );
}
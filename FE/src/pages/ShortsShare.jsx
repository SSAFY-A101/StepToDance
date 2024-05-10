import { useLocation } from "react-router";

function ShortsShare() {
    const location = useLocation();
    const state = location.state || [];
    const videourl = state[0]?.videourl;
    const videoFileValue = state[1]?.videoFileValue;

    return (
        <div>
            <div style={{color:"white"}}>결과</div>
            <video style={{maxWidth:'100%', height:'auto'}} controls>
                <source src={videourl} type={videoFileValue} />
              </video>
        </div>
    );
  }
  
  export default ShortsShare;
  
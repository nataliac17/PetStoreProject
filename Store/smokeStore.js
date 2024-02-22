import { sleep, check } from "k6";
import http from "k6/http"

export const options = {
    vus: 50,
    duration:"10s",
}

const BASE_URL ="http://localhost:10000/api/v3";
export default function() {
    let headersList = {
        "accept": "application/json",
        "Content-Type": "application/json"
    }
    
    let url = BASE_URL + `/store/inventory`;
    
    let request = http.get(url);

    check(request, {
        "successful operation": (r) => r.status === 200
    });
    

}
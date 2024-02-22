import { sleep, check } from "k6";
import http from "k6/http"

export const options = {
    vus: 10,
    duration:"10s",
};

const BASE_URL ="http://localhost:10000/api/v3";
let username = 'user1';
let password = 'XXXXXXXXXXX'; 
export default function() {
    let headersList = {headers:{
        "Accept": "application/json",
        "Content-Type": "application/json"
        }
    }
    let urlLoginUser= BASE_URL + `/user/login?username=${username}&password=${password}`;

    let requestLoginUser = http.get(urlLoginUser);
    check(requestLoginUser, {
        "successful login": (r) => r.status === 200
    });

    sleep(1);

}

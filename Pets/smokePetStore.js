import { sleep, check } from "k6";
import http from "k6/http"

export const options = {
    vus: 1,
    duration:"50s",
}

const BASE_URL ="http://localhost:10000/api/v3";
const file = open('simpsons.jpeg', 'b');
export default function() {
    let headersList = {
        "accept": "application/json",
        "Content-Type": "application/json"
    }

    let idRandom = Math.floor(Math.random() * 999) + 1;
        
    let bodyCreatePet = {
        "id": idRandom,
        "name": "doggie",
        "category": {
        "id": 1,
        "name": "Dogs"
        },
        "photoUrls": [
        "string"
        ],
        "tags": [
        {
            "id": 0,
            "name": "string"
        }
        ],
        "status": "available"
    };    

    let requestCreate = http.post(BASE_URL + `/pet`, JSON.stringify(bodyCreatePet), { 
        headers: headersList
        });

            sleep(3);

        let checkResponseCreate =    check(requestCreate, {
            'Pet created': (resp) => resp.status === 200,});  

        if(checkResponseCreate){
            let petID = requestCreate.json('id');

            let requestGetPetByID = http.get(BASE_URL + `/pet/${petID}`, { 
            headers: headersList
            });

            let checkResponseGet = check(requestGetPetByID, {
                'Pet found': (resp) => resp.status === 200,}); 
                
            if(!checkResponseGet){
                console.log(requestGetPetByID);
            } 

            sleep(3)
            const uploadData = {
                file: http.file(file, 'simpsons.jpeg'),
            };
            let params = {headers: {"Content-Type": "application/octet-stream", "Accept": "application/json"}};
            let requestUpdatePet = http.post(BASE_URL + `/pet/${petID}/uploadImage?`, uploadData, params);

            let checkResponseUpdate = check(requestUpdatePet, {
                "Pet Updated": (r) => r.status === 200
            });

            if(checkResponseUpdate){

                let requestDelete = http.del(BASE_URL + `/pet/${petID}`, { 
                    headers: headersList
                    });

                let checkResponseUpdate = check(requestDelete, {
                    "Pet deleted": (r) => r.status === 200
                });

                if(!checkResponseUpdate){
                    console.log(requestDelete);
                }

            }else{
                console.log("Pet wasn't update")
            }
        

        }else {
            console.log("Pet wasn't create", bodyCreatePet);
        }
 }
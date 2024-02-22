import { sleep, check } from "k6";
import http from "k6/http"

export const options = {
    stages:[
        {
            duration: "50s",
            target: 3,
        },
        {
            duration: "2m",
            target: 5,
        },
        {
            duration: "30s",
            target: 3,
        },
    ]
    
}

const BASE_URL ="http://localhost:10000/api/v3";
export default function() {
    let headersList = {headers:{
        "Accept": "application/json",
        "Content-Type": "application/json"
        }
    }
    
    let urlGetInventory = BASE_URL + `/store/inventory`;
    
    let requestGetInventory = http.get(urlGetInventory);

    check(requestGetInventory, {
        "Get Inventory Successful": (r) => r.status === 200
    });

    let idRandom = Math.floor(Math.random() * 999) + 1;

    sleep(3);

    let urlCreateOrder = BASE_URL + `/store/order`;
    let body = {
            "id": idRandom,
            "petId": 12,
            "quantity": 10,
            "shipDate": "2024-02-19T12:43:50.401Z",
            "status": "placed",
            "complete": true
          }
    let requestCreateOrder = http.post(urlCreateOrder, JSON.stringify(body), headersList);

   let checkCreateOrder= check(requestCreateOrder, {
        "Order Created": (r) => r.status === 200
    });

    if(checkCreateOrder){
        
        let orderId = requestCreateOrder.json("id");
        let urlGetOrder = BASE_URL + `/store/order/${orderId}`;
        let requestGetOrderByID = http.get(urlGetOrder);
        let checkGetOrder = check(requestGetOrderByID, {
            "Order found": (r) => r.status === 200
        });

        sleep(2);
        
        if(checkGetOrder){

            let urlDeleteOrder = BASE_URL + `/store/order/${orderId}`;
            let requestDeleteOrder = http.del(urlDeleteOrder);
            let checkDeleteOrder = check(requestDeleteOrder, {
                "Order deleted": (r) => r.status === 200
            });
        }

    }

}
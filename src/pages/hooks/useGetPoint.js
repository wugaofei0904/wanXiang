// import { async } from "q";
// import { authorList, tagList } from './../../utils/fetchApi';

import {
    adPoint
} from './../../utils/fetchApi';

const getPointList = async () => {
    const request = await fetch(adPoint);
    const req = await request.json();
    // console.log(req)
    return req;
}
export default getPointList;
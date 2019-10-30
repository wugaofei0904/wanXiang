// import { async } from "q";
// import { authorList, tagList } from './../../utils/fetchApi';

import {
    authorListNoPage
} from './../../utils/fetchApi';

const getAuthorList = async () => {
    const request = await fetch(authorListNoPage);
    const req = await request.json();
    console.log(req)
    return req;

}
export default getAuthorList;
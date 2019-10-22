// import { async } from "q";
import { authorList, tagList } from './../../utils/fetchApi';

const getTagList = async (tagId) => {
    const request = await fetch(tagList + '?tagId=' + tagId);
    const req = await request.json();
    console.log(req)
    return req;
}

export default getTagList;
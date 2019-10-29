// import { async } from "q";
import { authorList, tagList } from './../../utils/fetchApi';
import { domain } from './../../utils/fetchApi';
const getTagList = async (tagId) => {
    // const request = await fetch(tagList + '?tagId=' + tagId);
    const request = await fetch(domain + '/tag/list?' + '?tagId=' + tagId, {
        credentials: "include"
    });
    const req = await request.json();
    console.log(req)
    return req;
}

export default getTagList;
// import { async } from "q";
// import { authorList, tagList } from './../../utils/fetchApi';

import { domain } from './../../utils/fetchApi';

const getAnthorList = async () => {
    const request = await fetch(domain + '/author/list?name=测试');
    const req = await request.json();
    console.log(req)
    return req;

}
export default getAnthorList;
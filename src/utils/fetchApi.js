// http://open.suwenyj.xyz:8080/author/list-page?pageSize=10&pageNum=1&rank=1&tagId=1
// export const domain = 'http://open.suwenyj.xyz:8080';
export const domain = '/open';
// http://pubs.suwenyj.xyz:9876/
// export const domain = '';
//登陆
export const login = domain + '/login';

//文章列表
export const articleList = domain + '/article/list-page';

//导出
export const articleExport = domain + '/article/article-export';

//文章发布
export const postArticle = domain + '/article/create';

//作者列表页 分页
export const authorList = domain + '/author/list-page';

//作者列表页 不分页
export const authorListNoPage = domain + '/author/list';

//创建作者
export const createAuthor = domain + '/author/create';

//图片上传
export const imgUpload = domain + '/author/headImg';

//标签列表
export const tagList = domain + '/tag/list';

//搜索所有标签
export const searchTagList = domain + '/tag/searchTag';


//操作记录
export const recordList = domain + '/record/list';

//作者封禁还原
export const authorEdit = domain + '/author/edit';

//文章编辑 删除.还原
export const articleEdit = domain + '/article/edit';

//置换img
export const initBaseImg = domain + '/ueditor/uploadUrl';

//获取文章详情
// https://pub.suwenyj.xyz/open/article/article?id
export const articleDetail = domain + '/article/article';

//获取商品列表
export const adpageList = domain + '/ad/ad-page-list';

//发布商品
export const addAdItem = domain + '/ad/add-ad';



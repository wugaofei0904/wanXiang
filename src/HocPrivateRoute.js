import React from 'react';
import {withRouter} from 'react-router-dom';

function withHocPrivateRoute(WrappedComponent,hocProps){
    if(!!!WrappedComponent){
        throw new Error("缺少组件参数");
        return false;
    }
    //withRouter 也是一个高阶组件 传递 history
    return withRouter(
        class extends React.Component{
            constructor(props) {
                super(props);
                this.state = {
                    isAuthenticated:false
                }
            }

            componentWillMount(){
                this.judgeAuth(this.props.path);
            }
            componentWillReceiveProps(nextProps){
                this.judgeAuth(nextProps.path);
            }
            judgeAuth(path){
                let isAuthenticated = false;
                let authority = JSON.parse(sessionStorage.getItem("authority"));
                for(let value of authority){
                    if(value.menuIndex === path){
                        isAuthenticated = true;
                        break;
                    }
                }

                this.setState({isAuthenticated:isAuthenticated})
                if(!isAuthenticated){
                    const {history} = this.props;
                    setTimeout(() => {
                        history.replace("/login");
                    }, 1000)
                }
            }

            render(){
                return this.state.isAuthenticated ?  (
                    <WrappedComponent {...this.props} />
                ) : ("权限不足");
            }
        }
    )
}


export default withHocPrivateRoute;
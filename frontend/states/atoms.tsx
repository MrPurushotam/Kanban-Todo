import { api } from "@/lib/api";
import { Todo, User, Workspace } from "@/types/todo";
import {atom, selector} from "recoil"

export const userDetailsAtom= atom<User | null>({
    key:"userDetail",
    default:null
})

export const isAuthenticatedAtom= atom<boolean>({
    key:"isAuthenticated",
    default:false
})

// TODO: Add a way such that initially when dashboard is opened automatically workspaces are fetched could go with selector or useEffects

export const fetchUserAtom=selector<User|null|"Jwt Expired">({
    key:"fetchUserSelector",
    get:async({get})=>{
        const isAuthenticated = get(isAuthenticatedAtom);
        if(isAuthenticated){
            try {
                const resp =await api.get("/user/");
                if(resp.data.success){
                    return resp.data.user;
                }
                else if(resp.status===400 && resp.data.error==="Jwt Expired"){
                    return "Jwt Expired";
                }
            } catch (error:any) {
                console.error("Some error occured while fetching user details ",error.message);
                return null;
            }
        }
    }
})

export const workspaceAtom= atom<Workspace[]>({
    key:"workspaceList",
    default:[]
})

export const workspaceSelector = selector<Workspace|[]>({
    key:"fetchWorkspaces",
    get:async({get})=>{
        const isAuthenticated = get(isAuthenticatedAtom);
        const user = get(userDetailsAtom);
        if(isAuthenticated && user?.id){
            try {
                const resp = await api.get("/workspace/")
                if(resp.data.success){
                    return resp.data.Workspaces;
                }else{
                    console.error("Failed to fetch workspaces");
                    return [];
                }
            } catch (error:any) {
                console.error("Some error occurred while fetching workspaces", error.message);
                return [];
            }
        }
    }
})

export const todosAtom= atom<Todo[]>({
    key:"todos",
    default:[]
})

export const viewTypeAtom=atom<string>({
    key:"viewType",
    default:"list"
})

export const OnlineStatusAtom=atom({
    key:"isOnline",
    default:typeof navigator !== 'undefined' ? navigator.onLine : true,
    effects:[
        ({setSelf})=>{
            const checkStatus=()=>{
                if (typeof navigator !== 'undefined') { 
                    setSelf(navigator.onLine);
                }
                setTimeout(checkStatus, 10000);  
            }
            checkStatus();
        }
    ]
})
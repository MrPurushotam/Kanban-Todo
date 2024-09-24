import { atom } from "recoil";

export const SidebarAtom= atom<Boolean>({
    key:"isSidebarOpen",
    default:true
})
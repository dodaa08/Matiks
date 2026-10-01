import { Ripple } from "@/components/loading-ui/ripple";

const loading = ()=>{
    return<>
    <div className="flex min-h-screen items-center justify-center">
        <div className="size-50">
    <Ripple />
    <h1 className="text-center text-sidebar-foreground">Finding an opponent</h1>
  </div>
    </div>
        </>
};

export default loading;
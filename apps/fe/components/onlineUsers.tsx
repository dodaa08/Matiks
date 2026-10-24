import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from "@/components/ui/avatar";
import { onlineUser } from "@/types/types";

const MAX_VISIBLE = 7;
export default function OnlineUsers({users} : {users : onlineUser[]}) {
    const unique = users.filter((user, i, arr)=>user.id && arr.findIndex((u)=>u.id == user.id)===i)
    const visible = unique.slice(0, MAX_VISIBLE);
    const extra = unique.length - MAX_VISIBLE;

  return (
    <div>
        <AvatarGroup>
            {visible.map((user)=>(
  
             <div key={user.id} className="flex flex-col items-center gap-1">
          <Avatar className="size-16">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>
              {user.name?.slice(0, 2).toUpperCase() ?? "?"}
            </AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          </Avatar>
          <span className="max-w-16 truncate text-xs">{user.name}</span>
        </div>
                
            ))}
            {extra > 0 && <AvatarGroupCount className="size-16">+{extra}</AvatarGroupCount>}
        </AvatarGroup>
    </div>
  )
}

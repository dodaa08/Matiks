import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { onlineUser } from "@/types/types";

const MAX_VISIBLE = 7;
export default function OnlineUsers({users} : {users : onlineUser[]}) {
    const visible = users.slice(0, MAX_VISIBLE);
    const extra = users.length - MAX_VISIBLE;

  return (
    <div>
        <AvatarGroup>
            {visible.map((user)=>(
                <Avatar key={user.id} className="size-16 gap-3">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    <AvatarBadge className="bg-green-600 dark:bg-green-800 " />
                </Avatar>
            ))}
            {extra > 0 && <AvatarGroupCount className="size-16">+{extra}</AvatarGroupCount>}
        </AvatarGroup>
    </div>
  )
}

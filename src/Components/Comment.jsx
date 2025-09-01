import { useState } from "react";
import EditComment from "./EditComment/EditComment";
import toast from "react-hot-toast";
import axios from "axios";

export default function Comment({ comment }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  console.log(comment);

  if (!comment) return null;

  let { commentCreator, content, createdAt, _id } = comment;

  const imgPhoto =
    commentCreator?.photo && commentCreator.photo.trim() !== ""
      ? commentCreator.photo
      : "https://linked-posts.routemisr.com/uploads/default-profile.png";

  function deletePost(postId) {
    axios
      .delete(`https://linked-posts.routemisr.com/comments/${postId}`, {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((res) => {
        console.log(res);
        toast.success("Post deleted successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="w-full shadow-xs rounded-lg px-4 py-2 my-4 bg-black/5 text-[#520B05] relative">
      {/* Top section */}
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <img src={imgPhoto} className="w-8 h-8 rounded-full" alt="user" />
          <p className="text-lg font-semibold">{commentCreator?.name}</p>
        </div>
        <p className="text-xs m-5 text-gray-500">{createdAt}</p>
      </div>

      {isEditing ? (
        <EditComment
          id={_id}
          onCancel={() => setIsEditing(false)}
          onSave={() => setIsEditing(false)}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <p className="pl-6 text-sm">{content}</p>
      )}

      {/* Menu button + dropdown */}
      {_id && (
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="text-xl px-3 py-1 rounded-full hover:bg-gray-200"
          >
            ⋮
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setOpenMenu(false);
                }}
                className="flex w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => deletePost(_id)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

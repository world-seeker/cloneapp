import React, {  useEffect, useState } from 'react';
import {HeartIcon as HeartIconFilled} from "@heroicons/react/solid";    
import { BookmarkIcon, ChatIcon,
         DotsHorizontalIcon,
         EmojiHappyIcon,
         HeartIcon,
         PaperAirplaneIcon
     } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { addDoc, collection, query, onSnapshot, orderBy, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { serverTimestamp } from 'firebase/firestore';
import Moment from 'react-moment';


function Post({id,username,userImg,img,caption}:any) {
   const {data:session} = useSession();
   const [hasLiked,setHasLiked] = useState(false)
   const [likes,setLikes] = useState<any[]>([])
   const [comment,setComment]= useState("");
   const [comments,setComments] = 
   useState<{
       map: any;length:number,
   }>([]);
  
   useEffect(
      () => 
       onSnapshot(
         query(
            collection(db,"posts",id,"comments"),
            orderBy("timestamp","desc")),
            snapshot=>
            setComments(snapshot.docs)),
             [db,id]);

       useEffect(()=> 
       onSnapshot
       (collection(db,'posts',id,"likes"),
       (snapshot) =>
       setLikes(snapshot.docs))
        ,[db,id]);

       const likePost = async () =>{
         if(hasLiked){
           await deleteDoc(doc(db,'posts',id,'likes',session?.user?.uuid))
          }
         else{
            await setDoc(doc(db,'posts',id,'likes',session?.user?.uuid),{
               username:session?.user?.username,
            });

          }
         };

      
       useEffect(() =>{
         setHasLiked
         (
         likes.findIndex(like => like.id ===session?.user?.uuid)!== -1
         )
         },[likes]);
         
       const sendComment = async (e:any) => {
         e.preventDefault();
         const commentToSend = comment;
         setComment("");
         await addDoc(collection(db,"posts", id,"comments"), {
            comment:commentToSend,
            username:session?.user?.name,
            userImage:session?.user?.image,
            timestamp:serverTimestamp(),
         });
       };
       const data= async (e:any) => {
         e.preventDefault();
         const commentToSend = comment;
         setComment("");
         await addDoc(collection(db,"posts", id,"comments"), {
            comment:commentToSend,
            username:session?.user?.name,
            userImage:session?.user?.image,
            timestamp:serverTimestamp(),
         });
       };

  return (
    <div className='bg-white my-7 border rounded-sm '>
        {/**Header */}
         <div className='flex items-center p-5'>
            <img src={userImg}
             className='rounded-full w-12 h-12
             object-contain border p-1 mr-3'/>
            <p className='flex-1 font-bold'>{username}</p>
            <DotsHorizontalIcon className='h-5'/>
         </div>

        {/**img */}
        <img src={img}
             className='object-cover w-full'/>

        {/**Buttons*/}
{session && (
        <div className='flex justify-between pt-4'>
         <div className='flex space-x-4 '>
            { hasLiked ? (
               <HeartIconFilled onClick={likePost} className='btn text-red-500'/>
            ):
            (
            <HeartIcon onClick={likePost} className='btn'/>
            )}
            
            <ChatIcon className='btn'/>
            <PaperAirplaneIcon className='btn'/>
         </div>
         <BookmarkIcon className="btn "/>
        </div>

)}


        {/**Caption */}
         <p className='p-5 truncate'>
            {likes.length > 0 && (
               <p className='font-bold mb-1 '>{likes.length} Like</p>
            )}
          <span className="font-bold mr-1">
           {username}
          </span>
          {caption}
         </p>
 
        {/** comments */} 
         {comments.length > 0 && (
            <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
               {comments.map((comment: {id: React.Key | null | undefined; data: () => {username:any,userImage:any,timestamp:any,comment:any}; }) => (
                  <div key={comment.id} className='flex items-center space-x-2 mb-3 '>
                     <img 
                     className='h-7 rounded-full'
                     src={comment.data().userImage} alt="jj"/>
                     <p className="flex-1  text-sm">
                     <span className='font-bold'>{comment.data().username} </span>
                     {comment.data().comment}</p>
                     <Moment  className='text-xs pr-5' fromNow>
                        {comment.data().timestamp?.toDate()}
                        </Moment>
                     </div>
               ))}
               </div>
         )}
    

        
        {/**input box */}
        {session && (
         <div>
            <form className="flex  items-center p-4">
             <EmojiHappyIcon className='btn'/> 
             <input
              value={comment} 
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setComment(e.target.value)}
              type="text"
              placeholder="Add your comment"
              className='border-none flex-1 focus:ring-0 ouline-none'
              />
              <button type="submit" disabled={!comment.trim()}  onClick={sendComment} className='font-semibold text-blue-400'>Post</button>
            </form>
         </div>
        )}

      
    </div>
  )
}

export default Post



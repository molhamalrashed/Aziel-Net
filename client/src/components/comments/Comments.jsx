// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import PropTypes from "prop-types";
// import TimeAgo from "react-timeago";
// import useFetch from "../../hooks/useFetch";

// const Comments = ({ post }) => {
//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");

//   const [commentData, setCommentData] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const {
//     performFetch: performGetCommentsFetch,
//     error,
//     isLoading,
//   } = useFetch(`/posts/${post?._id}/comment`, setCommentData);

//   useEffect(() => {
//     if (post && post._id) {
//       performGetCommentsFetch();
//     }
//   }, [post, performGetCommentsFetch]);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();

//     if (!post || !post._id || newComment.trim() === "") {
//       return;
//     }

//     if (userId && post._id) {
//       const options = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userId: userId,
//           postId: post._id,
//           text: newComment,
//         }),
//       };

//       performGetCommentsFetch(options);
//       setNewComment("");
//     }
//   };

//   return (
//     <Container>
//       {isLoading && <p>Loading comments...</p>}
//       {error && <p>Error fetching comments</p>}
//       <CommentList>
//         {commentData.map((comment) => (
//           <CommentItem key={comment._id}>
//             <strong>{comment.username}</strong>
//             <p>{comment.text}</p>
//             <TimeAgo date={comment.timestamp} />
//           </CommentItem>
//         ))}
//       </CommentList>
//       <CommentForm onSubmit={handleCommentSubmit}>
//         <textarea
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Add a comment..."
//         />
//         <button type="submit">send</button>
//       </CommentForm>
//     </Container>
//   );
// };

// Comments.propTypes = {
//   post: PropTypes.object.isRequired,
// };

// const Container = styled.div`
//   margin-top: 1rem;
// `;

// const CommentList = styled.div`
//   margin-bottom: 1rem;
// `;

// const CommentItem = styled.div`
//   margin-bottom: 1rem;
// `;

// const CommentForm = styled.form`
//   display: flex;
//   textarea {
//     flex-grow: 1;
//     margin-right: 1rem;
//   }
// `;

// export default Comments;

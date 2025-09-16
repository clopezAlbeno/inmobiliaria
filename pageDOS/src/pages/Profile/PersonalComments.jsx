import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CardComment } from "../../components/CardComments/CardComment";

export const PersonalComments = () => {
  const { id } = useParams();

  const headers = {
    "content-types": "aplication/json",
    Authorization: localStorage.getItem("token"),
  };

  const [comments, setMyComments] = useState(null);
  const getMyComments = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3200/comment/getCommentsByUser/${id}`,
        { headers: headers }
      );
      setMyComments(data.comments);
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    getMyComments();
  }, []);
  return (
    <>
      {comments == null ? (
        <p className="notFoundCommentsInProfile">No tienes comentarios</p>
      ) : (
        <div className="myComments">
          {comments.comments.map(({_id, title, description, date, hour, approve}, key)=>{
            return <CardComment
            key={key}
            idUser={comments.user?._id}
            email={comments.user?.email}
            idTip={_id}
            title={title}
            description={description}
            date={date}
            hour={hour}
            state={approve}
          />
          })}
              
        </div>
      )}
    </>
  );
};

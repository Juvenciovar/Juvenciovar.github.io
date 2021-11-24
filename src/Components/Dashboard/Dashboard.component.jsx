import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import "./Dashboard.css"
import { auth, db } from "../../Firebase/Config"
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc
} from "firebase/firestore"
import { 
  signOut
} from "firebase/auth";

function Dashboard() {

  const COMPLETE_STATUS = "complete";
  const EMPTY_STATUS = "empty";
  const LOADING_STATUS = "loading";

  const [articleId, setArticleId] = useState("");
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [sectionState, setSectionState] = useState("");
  const [status, setStatus] = useState(EMPTY_STATUS);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  const articlesCollection = collection(db, "articles");
  const history = useHistory();
  const date = new Date()
  const userState = localStorage.getItem("userState");
  

  // Create an article
  const createArticle = () => {
    addDoc(articlesCollection, {title: title, text: text, date: date.toISOString()}).then(
      getArticles(),
      setSectionState("show")
    ).catch(e => {
      console.log(e);
    })
  };
  
  // Update an article
  const updateArticle = () => {
    const newFields = {title: title};

    updateDoc(doc(db, "articles", articleId), newFields).then(
      setSectionState("show"),
      getArticles()
    ).catch(e => {
      console.log(e);
    })
  }

  // Delete an article
  const deleteArticle = () => {
    const userDoc = doc(db, "articles", articleId);
    deleteDoc(userDoc).then(
      getArticles()
    ).catch(e => {
      console.log(e);
    })
  }

  // Get articles
  const getArticles = () => {
    const dataDoc = getDocs(articlesCollection);
    
    dataDoc.then( data => {
      setArticles(data.docs.map(doc=>({ ...doc.data(), id: doc.id})))
    }).catch(e => {
      console.log(e);
    })
      
    setSectionState("show");
  }

  const creatorMode = () =>{
    setSectionState("new");
  }

  useEffect(() => {
    if(status === EMPTY_STATUS){
      setStatus(LOADING_STATUS);
      getArticles();
      setStatus(COMPLETE_STATUS);
    }
  })

  const logout = () => {
    signOut(auth).then(
      localStorage.setItem("userState", "logout"),
      history.push("/")
    ).catch(e => {
      console.log(e);
    })
  };

  const editArticle = (article) => {
    setSectionState("edit");

    setArticleId(article.id);
    setText(article.text);
    setTitle(article.title);
  }

  useEffect(() => {
    const url = title.replace(/ /g,"-");
    history.push(`/Dashboard/${url}`);
  })

  const closeEditor = () => {
    history.push('/Dashboard');
    setSectionState("show");
  }
  
  if(userState === "loggedIn"){
      return (
        <div className={"DashboardContainer"}>
          <nav>
            <div>Welcome {localStorage.getItem("email")}</div>
            <button onClick={logout}>Log out</button>
          </nav>

          {(sectionState==="show") ? (
            <section>

            <div className={"sectionHeader"}>
              <button onClick={creatorMode} className={"add"}>Add</button>
              <input placeholder={"Search..."} onChange={e => { setSearch(e.target.value)}}/>
            </div>

            

            <div className={"articles"}>
              {articles.map(article => {
                return(
                  (article.title.includes(search) || article.text.includes(search))?(
                      <div key={article.title} className={"article"} onClick={() => {editArticle(article)}}>
                        <span>Edited: {String(article.date).substring(0,10)}</span>
                        <h3>{article.title}</h3>
                        <p>{article.text}</p>
                      </div>
                  ):(
                    <div></div>
                  )
                )
              })}
            </div>

            </section>
          ):((sectionState==="edit")?( 
            <section>
                <div className={"sectionHeader sectionHeaderEdit"}>
                  <button onClick={closeEditor}>X</button>
                </div>
                <div className={"articleEdit"}>
                  <div className={"title"}>
                    <div className="left">Title</div> 
                    <textarea value={title} className="right" onChange={e => {setTitle(e.target.value)}} />
                  </div>
                  <div className={"text"}>
                    <div className="top">
                      Text
                    </div>
                    <textarea value={text} className="bottom" onChange={e => {setText(e.target.value)}} />
                  </div>
                </div>
                <div className={"sectionFooterEdit"}>
                  <button onClick={updateArticle}>Edit</button>
                  <button onClick={deleteArticle}>Delete</button>
                </div>
              </section>
            ):(
              <section>
                <div className={"sectionHeader sectionHeaderEdit"}>
                  <button onClick={() => setSectionState("show")}>X</button>
                </div>
                <div className={"articleEdit"}>
                  <div className={"title"}>
                    <div className="left">Title</div> 
                    <textarea placeholder="Title goes here..." className="right" onChange={e => {setTitle(e.target.value)}}/>
                  </div>
                  <div className={"text"}>
                    <div className="top">
                      Text
                    </div>
                    <textarea placeholder="Text goes here..." className="bottom" onChange={e => {setText(e.target.value)}}/>
                  </div>
                </div>
                <div className={"sectionFooterEdit"}>
                  <button onClick={createArticle}>Create</button>
                </div>
              </section>
            )
          )} 

          

        </div>
      )
  }else{
    return(
      <div className={"message404"}>you must be logged :(</div>
    )
  }

}
  
export default Dashboard;
  
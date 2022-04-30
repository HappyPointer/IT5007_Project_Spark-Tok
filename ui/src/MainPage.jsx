/* globals React */
/* eslint "react/jsx-no-undef": "off" */

import graphQLFetch from './graphQLFetch.js';
import './style.css'
import ParticlesBg from 'particles-bg' 

// this.state contains two variables： recommendation (record the paper info) / userEmail (record the user info)
// userEmail is a string； recommendation is a dictionary, like below:
// recommendation : {
//     paper: {     (also a dictionary)
//           _id: "626a5d4cd3ecdc250a0d5574",    (unique code of this paper)
//           title: "High-quality Conversational Systems",   (paper title)
//           authors: "Samuel Ackerman, Ateret Anaby-Tavor, Eitan Farchi",    
//           abstract: "Conversational systems or chatbots are an example of AI-Infused Applications (AIIA)"  
//           labels: ["NLP", "GNN"]    (used to display "comments", to show which type of this paper is)
//     }
//     hasComment: true     (if false, will show no comments.)
//     comment: We are recommending you this paper because you seem to like -- NLP --   ( if this.state.recommendation.hasComment == false, this comment will be null）
//     (if hasComment is true, we will show comment in the front-end)
// }


export default class MainPage extends React.Component {
  constructor() {
    super();
    // -------------------------------------------------------
    // This part is modified by He Yingzhi 
    this.state = { recommendation: {paper:{_id: null}, hasComment: 'block', comment: null}, userEmail: null, isToggleOn: true, disp_register:true, disp_register_fills:false, disp_login:true, disp_login_fills:false};
    this.getNextRecommendation = this.getNextRecommendation.bind(this);
    this.likeCurrentPaper = this.likeCurrentPaper.bind(this);
    this.handle_like_click = this.handle_like_click.bind(this);
    this.handle_getNextRecommendation = this.handle_getNextRecommendation.bind(this);
    this.userRegister = this.userRegister.bind(this);
    this.handleSubmit_register = this.handleSubmit_register.bind(this);
    this.validateLogin = this.validateLogin.bind(this);
    this.handleSubmit_login = this.handleSubmit_login.bind(this);
    this.handleClick_openRegister = this.handleClick_openRegister.bind(this);
    this.handleClick_openLogin = this.handleClick_openLogin.bind(this);
  } 

  componentDidMount() {
    this.getNextRecommendation(); // show the next paper at the beginning
  }


  // getting a new recommended paper based on user account status kept in this.state
  async getNextRecommendation() {
    if (this.state.userEmail != null) {  // if loged in, recommend specific paper based on interest
      const query = `query getNextRecommendation($userEmailVar: String!, $lastPaperIDVar: String){
        recommendPaper(userEmail:$userEmailVar, lastPaperID: $lastPaperIDVar) {
          paper {
              _id,
              title,
              authors,
              abstract,
              labels,
            },
          hasComment,
          comment
        }
      }`;

      let userEmailVar = this.state.userEmail;
      let lastPaperIDVar = this.state.recommendation.paper._id;

      const data = await graphQLFetch(query, { userEmailVar, lastPaperIDVar });
      if (data) {
        this.setState({ recommendation: data.recommendPaper });
      }
    }
    else {  // if not loged in, randomly recommend papers
      const query = `query getRandomPaper($lastPaperIDVar: String){
        randomPaper(lastPaperID: $lastPaperIDVar) {
          paper {
              _id,
              title,
              authors,
              abstract,
              labels,
            },
          hasComment,
          comment
        }
      }`;
      let lastPaperIDVar = this.state.recommendation.paper._id;
      const data = await graphQLFetch(query, { lastPaperIDVar });
      if (data) {
        this.setState({ recommendation: data.randomPaper });
      }
    }
  }

  // Send the server a record indicating that the user likes the current paper.
  // The interest of login users will be recorded, which will effect the recommendation results in the further
  // The user that has not logged in, a chatbot informing that he should log in first will appear
  async likeCurrentPaper() {
    let userEmailVar = this.state.userEmail;
    let labelsVar = this.state.recommendation.paper.labels;

    if (userEmailVar == null) {
      alert("To share us with your interest, you need to log in first (*^_^*)");
      return null;
    }

    const query = `mutation likeCurrentPaper($userEmailVar: String!, $labelsVar: [String!]){
      likePaper(u_email:$userEmailVar, labels: $labelsVar) {
        email
      }
    }`;

    const data = await graphQLFetch(query, { userEmailVar, labelsVar });
  }

  // send the email and password to the backend to add to the DB, if these parameters are valid. 
  async userRegister(userEmailVar, new_pwd) {
    const query = `mutation userRegister($userEmailVar: String!, $new_pwd: String!){
      addUser(u_email:$userEmailVar, u_password: $new_pwd)
    }`;

    const data = await graphQLFetch(query, { userEmailVar, new_pwd });
    if (data) {
      alert(data.addUser)
      return data.addUser == "User registered successfully!";
    } else {
      alert("User register failed: unable to parse result from server!")
      return false
    }
  }

  // validate whether the log in is successful
  async validateLogin(userEmailVar, userPWDVar) {
    const query = `query validateLogin($userEmailVar: String!, $userPWDVar: String!){
      checkLogin(userEmail:$userEmailVar, userPWD: $userPWDVar)
    }`;
    const data = await graphQLFetch(query, { userEmailVar, userPWDVar });
    if (data) {
      return data.checkLogin;
    } else {
      return false;
    } // the return value is boolean
  }


  // like button pressed handler function
  handle_like_click(e) {
    e.preventDefault();
    
    if (this.state.isToggleOn == true){
      this.likeCurrentPaper();
      this.setState({isToggleOn: false});
      alert('You like this paper!');
    }
    else{
      alert('You have aleady liked this paper!');
    }
  }

  // click and recommend next paper!
  handle_getNextRecommendation(e){
    e.preventDefault();
    this.getNextRecommendation();
    this.setState({isToggleOn: true});
  }

  // click and check the register info, then call the function to really send the info to backend
  async handleSubmit_register(e) {
    e.preventDefault();
    const form = document.forms.register;
    if (form.userEmail.value == ""  ||  !(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(form.userEmail.value)))
    {
      alert("The input email is not valid!")  //check whether the email format is valid
    }

    else{
      if (form.password.value != form.double_check_password.value){
        alert('The entered passwords are inconsistent. '); // also check whether the passwords input two times are the same, must be the same!
      }
      else{  // then can really register in.
        let register_result = await this.userRegister(form.userEmail.value, form.password.value)
        if (register_result) {
          this.setState({disp_register_fills: false})
        }
      }
    }
    form.userEmail.value = ""; form.password.value = "";form.double_check_password.value = "";
  }

  // send the login info to backend
  async handleSubmit_login(e) {
    e.preventDefault();
    const form1 = document.forms.login;
    let login_result = await this.validateLogin(form1.userEmail1.value, form1.password1.value);
    if(login_result){
      alert('log In successful')
      this.setState({userEmail: form1.userEmail1.value, disp_login: false, disp_login_fills: false, disp_register: false, disp_register_fills: false});
    }
    else{
      alert('log In failed')
    }
    form1.userEmail1.value = ""; form1.password1.value = "";
  }

  // when click the register button, show the register info, and close the login info
  handleClick_openRegister(){
    this.setState({disp_register_fills: !this.state.disp_register_fills
    ,disp_login_fills:false})
  }

  // when click the login button, show the login info, and close the register info
  handleClick_openLogin(){
    this.setState({disp_login_fills: !this.state.disp_login_fills,
    disp_register_fills:false})
  }

  render() {
    return (
      <div>
        <h1 className='vintage'>Spark Tok</h1>  
        {/* The name of the project */}
      <div>
        { this.state.disp_register &&
          <button onClick={this.handleClick_openRegister}>Open Register</button>
        }
        { this.state.disp_login &&
          <button onClick={this.handleClick_openLogin}>Open LogIn</button>
        }
      </div>
        {/* Two buttons to open/close the login or reigster */}
      {
          this.state.disp_register_fills &&
        <form name="register" onSubmit={this.handleSubmit_register} style={{display: this.state.disp_register_fills}}>
          <input type="text" name="userEmail" placeholder="user Email" />
          <input type="password" name="password" placeholder="Password" />
          <input type="password" name="double_check_password" placeholder="double check password" />
          <button className='button11'>Register</button>
        </form>
        }

        { this.state.disp_login_fills &&
          <form name="login" onSubmit={this.handleSubmit_login} style={{display: this.state.disp_login_fills}}>
          <input type="text" name="userEmail1" placeholder="user Email" />
          <input type="password" name="password1" placeholder="Password" />
          <button className='button11' style={{float:'left'}}>LogIn</button>
          </form>
        }
        {/* Two forms to require detailed info for login /register */}

        <ul className='button_loc'>
          <li className='button_loc'>
          <form name="add_btn_submit" onSubmit={this.handle_like_click}>
          <button className='button'>LIKE</button>
          </form>
          <form name="add_btn_submit11" onSubmit={this.handle_getNextRecommendation}>
          <button className='button'>Next Paper</button>
          </form>
          </li>
        </ul>
        {/* if you like the paper, click the like. But you need to login first! And will prompt an alert message. Then you can press NextPaper. */}
        <ul className="tabs" role="tablist">
          <li>
              <input type="radio" name="tabs" id="tab1" defaultChecked={true}/>
              <label htmlFor="tab1"
                    role="tab"
                    aria-selected="true"
                    aria-controls="panel1"
                    tabIndex="0">Abstract</label>
              <div id="tab-content1"
                  className="tab-content"
                  role="tabpanel"
                  aria-labelledby="description"
                  aria-hidden="false">
                  <p style={{fontSize:"5px"}}>TITLE:<br/>{this.state.recommendation.paper.title}</p>
                  <p style={{fontSize:"5px"}}>AUTHORS:<br/>{this.state.recommendation.paper.authors}</p>
                  {this.state.recommendation.hasComment&&<p style={{fontSize:"5px"}}>COMMENTS:<br/>{this.state.recommendation.hasComment && this.state.recommendation.comment} </p >}
              </div>
          </li>
          {/* This block shows the Title, Authors and Comments(which type of paper recommend to you) */}
          <li>
              <input type="radio" name="tabs" id="tab2" />
              <label htmlFor="tab2"
                    role="tab"
                    aria-selected="false"
                    aria-controls="panel2"
                    tabIndex="0">Author Info</label>
              <div id="tab-content2"
                  className="tab-content"
                  role="tabpanel"
                  aria-labelledby="specification"
                  aria-hidden="true">
                  <p style={{fontSize:"5px"}}>{this.state.recommendation.paper.abstract}</p>
              </div>
          </li>
        </ul>
          {/* this block shows the Abstract of the paper */}
        <ParticlesBg type="ball" bg={true}/>
        {/* This is the active background. */}
      </div>
    );
  }
}

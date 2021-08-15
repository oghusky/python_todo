const pathname = window.location.pathname;
        let pweets = []

// register
if (pathname.includes('register')) {
    const registerBtn = $("#register-btn");
    registerBtn.on("click", () => {
        $.ajax({
            url: '/register',
            method: "POST",
            data: {
                name: $("#name").val(),
                email: $("#email").val(),
                pwd: $("#password").val()
            },
            success: res => {
                if(res.data.status === 200) window.location.pathname = '/login';
            },
            error: err => {
                console.log(err);
            }
        })
    })
}
// login
if (pathname.includes('login')) {
    const loginBtn = $('#login-btn');
    loginBtn.on('click', () => {
        $.ajax({
            url: '/login',
            method: "POST",
            data: {
                name: $("#name").val(),
                pwd: $("#password").val()
            },
            success: res => {
                if (res.data.status === 200) {
                    localStorage.setItem("user_id", res.data.user.id);
                    localStorage.setItem("user_name", res.data.user.name);
                    window.location.pathname = `profile/${res.data.user.id}`
                };
            },
            error: err => {
                console.log(err);
            }
        })
    })
}
// user profile
if (pathname.includes("profile")) {
    if (localStorage.getItem("user_id")) {   
        getPweets(localStorage.getItem("user_id"));
        $.ajax({
            url: `/api${pathname}`,
            method: "GET",
            success: res => {
                $(".user-info").html(`
                <h1 class="text-center">HI &#128075; ${res.data.user.name.toUpperCase()}!</h1>
                <div class='form'>
                    <input class='form-control' type='text' id='pweet_text' name='pweet_text' placeholder='Say something'/>
                    <button class='btn btn-primary' id="pweet-btn">SUBMIT</button>
                <div>
                </div>
                `)
            },
            error: err => {
                console.log(err);
            }
        })
    } else {
        window.location.pathname = '/login';
    }
    // get pweets based on user id
    async function getPweets(userid) {
        document.querySelector(".my-pweets").innerHTML = "";
        const res = await $.ajax({
            url: `/api/pweets/${userid}`,
            method: "GET"
        })
        pweets = res.data.pweets;
        pweets.map(item => {
            document.querySelector(".my-pweets").innerHTML += `
                <div class='pweet-box my-2 p-2'>
                    <p><small><b>${item.owner_name}</b></small></p>
                    <p>${item.text}</p>
                </div>
            `
        })
    }
    // add functionality to pweet button
    $(document).on("click", "#pweet-btn", () => {
        $.ajax({
            url: `/api/pweets/${localStorage.getItem("user_id")}`,
            method: "POST",
            data: {
                text: $("#pweet_text").val()
            },
            success: res => {
                if(res.data.status === 200) getPweets(localStorage.getItem("user_id"))
            },
            error: err => {
                console.log(err);
            }
        })
    })
    // handle logout
    $("#logout").on("click", () => {
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        window.location.pathname = '/login';
    })
}

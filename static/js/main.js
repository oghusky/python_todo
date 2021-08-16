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
        getPweets(pathname.split("/")[2]);
        $.ajax({
            url: `/api${pathname}`,
            method: "GET",
            success: res => {
                console.log(pathname.split("/")[2])
                $(".user-info").html(`
                <h1 class="text-center">${res.data.user.name.toUpperCase()}'s Pweets!</h1>
                <div class='form'>
                    <input class='form-control mb-1' type='text' id='pweet_text' name='pweet_text' placeholder='Say something'/>
                    <p class="text-center">
                        <button class='btn btn-primary btn-block w-100' id="pweet-btn">SUBMIT</button>
                    </p>
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
        pweets.reverse().map(item => {
            document.querySelector(".my-pweets").innerHTML += `
                <div class='pweet-box my-2 p-2'>
                    <p id='item_owner_name' class="my-0">
                        <small>
                            <b>
                                <a href="/profile/${item.owner}">${item.owner_name}</a>
                            </b>
                        </small>
                    </p>
                    <p class="my-0"><small><i>${item.createdAt}</i></small></p>
                    <p class="my-0">${item.text}</p>
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
                if (res.data.status === 200) getPweets(localStorage.getItem("user_id"))
            },
            error: err => {
                console.log(err);
            }
        });
        document.querySelector("#pweet_text").value = "";
    })
    // handle logout
    $("#logout").on("click", () => {
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        window.location.pathname = '/login';
    })
}

// get all pweets
if (pathname.includes("all_pweets")) {
    $.ajax({
        url: "/api/all_pweets",
        method: "GET",
        success: res => {
            console.log(res);
            pweets = res.data.pweets;
        pweets.reverse().map(item => {
            document.querySelector(".my-pweets").innerHTML += `
                <div class='pweet-box my-2 p-2'>
                    <p id='item_owner_name' class="my-0">
                        <small>
                            <b>
                                <a href="/profile/${item.owner}">${item.owner_name}</a>
                            </b>
                        </small>
                    </p>
                    <p class="my-0"><small><i>${item.createdAt}</i></small></p>
                    <p class="my-0">${item.text}</p>
                </div>
            `
        })
        },
        error: err => {
            console.log(err);
        }
    })
}
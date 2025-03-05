import {Link} from "react-router-dom";

type props = {
    route: string,
    text: string,
}

const HomePageButton = ({route, text} : props) => {
    return(
        <div className="px-4 w-full h-full flex justify-center items-center">
            <Link
                className='hover:bg-btnBgHover active:bg-btnBgActive bg-btnBg border rounded-md py-2 px-6 text-center'
                to={route}>
                {text}
            </Link>
        </div>
    )
}

export default HomePageButton;
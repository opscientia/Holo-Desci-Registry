import { useParams, Navigate, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { searchHolos } from "../utils/holoSearch";

const SearchArrow = () => {
  return (
    <div className="search-icon code w-embed">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.125 10H16.875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M11.25 4.375L16.875 10L11.25 15.625" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </div>
  );
};
// Empty search bar, vs search bar style when credentials have been typed that shows suggestions
const EmptySearch = (props) => {
  return <input onChange={props.onChange} className="text-field w-input" maxLength="256" placeholder="Discover others by email, Twitter, etc." />;
};

const SearchWithSuggestions = (props) => {
  return (
    <div className="search-wrapper">
      <div className="search-diiv no-hover">
        <div className="search-int-div">
          <div className="search-icon code w-embed">
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.0625 16.125C12.6869 16.125 15.625 13.1869 15.625 9.5625C15.625 5.93813 12.6869 3 9.0625 3C5.43813 3 2.5 5.93813 2.5 9.5625C2.5 13.1869 5.43813 16.125 9.0625 16.125Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path d="M13.7031 14.2031L17.5 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
          <input
            id="suggestions-searchbar"
            className="search-text"
            onChange={props.onChange}
            style={{ backgroundColor: "transparent", border: "none" }}
          ></input>
        </div>
        <img src="images/X.svg" loading="lazy" alt="" className="search-icon" />
      </div>
      {props.credentials ? (
        <>
          <div className="searchLine"></div>

          <div className="search-diiv" onClick={() => props.searchWithService("holosearch")}>
            <div className="search-int-div">
              <div className="search-icon code w-embed">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>
              </div>
              <div className="search-name">
                {/* <div className="search-text">Vitalik Buterin</div> */}
                <div className="search-text highlight">{props.credentials}</div>
              </div>
            </div>
            <SearchArrow />
          </div>

          <div className="search-diiv" onClick={() => props.searchWithService("Google")}>
            <div className="search-int-div">
              <div className="search-icon code w-embed">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14.998 2.30957C14.1498 3.11598 13.3125 3.91208 12.4616 4.71849C12.4182 4.68242 12.3505 4.63347 12.2881 4.58194C11.5565 3.98422 10.711 3.62353 9.7544 3.49986C8.89808 3.38908 8.06073 3.46121 7.24777 3.73946C6.28847 4.06666 5.49448 4.61801 4.85495 5.36774C4.45931 5.83149 4.16935 6.35192 3.94443 6.91099C3.66531 7.61177 3.57047 8.33573 3.6355 9.07257C3.72764 10.134 4.13683 11.0873 4.83598 11.9221C5.38608 12.579 6.06355 13.0814 6.86838 13.4267C7.38597 13.6482 7.93065 13.7874 8.49702 13.8337C9.43463 13.9136 10.3452 13.8054 11.2204 13.4705C12.0632 13.1484 12.7569 12.6434 13.2637 11.9195C13.5672 11.4866 13.7704 11.01 13.8788 10.4999C13.887 10.4664 13.887 10.4329 13.8951 10.3814C12.261 10.3814 10.6378 10.3814 9.00647 10.3814C9.00647 9.2658 9.00647 8.16827 9.00647 7.063C11.8247 7.063 14.6349 7.063 17.4613 7.063C17.483 7.17893 17.5073 7.29745 17.5236 7.41338C17.6049 7.96731 17.651 8.52381 17.632 9.0803C17.5968 10.201 17.399 11.2908 16.9627 12.3343C16.6077 13.1845 16.1145 13.9522 15.4749 14.6376C14.7216 15.444 13.8219 16.0546 12.7867 16.4874C11.906 16.8558 10.9874 17.0697 10.0308 17.1573C9.54574 17.2036 9.05796 17.2191 8.57018 17.1959C7.04724 17.1238 5.63268 16.7141 4.32923 15.9618C3.64634 15.5676 3.02849 15.0936 2.47839 14.5422C1.57329 13.6431 0.912081 12.5996 0.486631 11.4197C0.272551 10.8297 0.123508 10.2242 0.055761 9.60331C0.0178228 9.25035 -0.00656608 8.89223 0.00156354 8.53669C0.0205327 7.50613 0.223773 6.50907 0.616705 5.54808C0.968988 4.68757 1.44864 3.90178 2.0692 3.19327C2.78189 2.37913 3.62195 1.71443 4.59209 1.19142C5.46467 0.72252 6.39687 0.405625 7.38055 0.233007C8.03905 0.11707 8.70568 0.0732718 9.37502 0.101612C10.2774 0.137681 11.1581 0.289688 12.0117 0.578243C13.0144 0.918325 13.9168 1.42072 14.7243 2.08027C14.8219 2.16014 14.914 2.24001 14.998 2.30957Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <div className="search-name">
                {/* <div className="search-text">Vitalik Buterin</div> */}
                <div className="search-text highlight">{props.credentials + (props.credentials.includes("@") ? "" : "@gmail.com")}</div>
              </div>
            </div>
            <SearchArrow />
          </div>

          <div className="search-diiv" onClick={() => props.searchWithService("twitter")}>
            <div className="search-int-div">
              <div className="search-icon code w-embed">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19.196 6.57039L16.8366 8.92195C16.3679 14.3829 11.7585 18.6251 6.2507 18.6251C5.11788 18.6251 4.18038 18.4454 3.46945 18.0938C2.89913 17.8048 2.66476 17.5001 2.60226 17.4063C2.55055 17.3278 2.51723 17.2386 2.50478 17.1454C2.49233 17.0522 2.50107 16.9573 2.53036 16.868C2.55964 16.7786 2.60872 16.697 2.67392 16.6293C2.73912 16.5615 2.81878 16.5093 2.90695 16.4766C2.92257 16.4688 4.76632 15.7657 5.96163 14.4141C5.22034 13.8863 4.56878 13.2427 4.03195 12.5079C2.96163 11.0548 1.82882 8.53132 2.50851 4.7657C2.52988 4.65375 2.58108 4.54965 2.65671 4.46439C2.73234 4.37913 2.82959 4.31589 2.9382 4.28132C3.04714 4.24565 3.16381 4.24063 3.27542 4.26681C3.38703 4.29299 3.48929 4.34936 3.57101 4.42976C3.59445 4.46101 6.19601 7.02351 9.3757 7.85164V7.37507C9.37876 6.87954 9.47941 6.38945 9.67188 5.93281C9.86436 5.47617 10.1449 5.06191 10.4975 4.71369C10.85 4.36547 11.2677 4.09011 11.7267 3.90332C12.1857 3.71653 12.677 3.62199 13.1726 3.62507C13.823 3.63435 14.4598 3.81193 15.0212 4.14053C15.5825 4.46912 16.0492 4.93751 16.3757 5.50007H18.7507C18.8741 5.49969 18.9948 5.53583 19.0977 5.60396C19.2006 5.67208 19.281 5.76913 19.3288 5.88289C19.3738 5.99833 19.3853 6.12416 19.3618 6.24583C19.3383 6.36749 19.2808 6.48002 19.196 6.57039V6.57039Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <div className="search-name">
                {/* <div className="search-text">Vitalik Buterin</div> */}
                <div className="search-text highlight">{"@" + props.credentials}</div>
              </div>
            </div>
            <SearchArrow />
          </div>

          <div className="search-diiv" onClick={() => props.searchWithService("ORCID")}>
            <div className="search-int-div">
              <div className="search-icon code w-embed">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_367_826)">
                    <path
                      d="M9.48605 0.5C9.83652 0.5 10.187 0.5 10.5375 0.5C10.5608 0.5 10.6076 0.523364 10.6309 0.523364C10.6776 0.523364 10.7477 0.523364 10.7945 0.523364C11.0047 0.546729 11.215 0.570093 11.4019 0.593458C11.729 0.640187 12.0561 0.71028 12.3833 0.780374C12.7571 0.873832 13.1309 0.990654 13.4814 1.13084C13.7618 1.24766 14.0655 1.36449 14.3225 1.50467C14.5328 1.59813 14.7431 1.71495 14.9533 1.83178C15.187 1.9486 15.3973 2.08879 15.6076 2.22897C15.8879 2.41589 16.1449 2.62617 16.4019 2.83645C16.5889 3 16.7758 3.16355 16.9393 3.3271C17.0328 3.42056 17.1029 3.49065 17.1963 3.58411C17.2431 3.63084 17.2898 3.67757 17.3365 3.74766C17.4533 3.88785 17.5702 4.00467 17.6636 4.14486C17.7804 4.28505 17.8973 4.42523 18.0141 4.58879C18.1776 4.79907 18.3178 5.00935 18.458 5.24299C18.5748 5.42991 18.6917 5.61682 18.7851 5.80374C18.9954 6.17757 19.1823 6.57477 19.3225 6.99533C19.4393 7.34579 19.5561 7.6729 19.6496 8.04673C19.7431 8.3972 19.8132 8.74766 19.8599 9.09813C19.9066 9.37851 19.93 9.65888 19.93 9.93925C19.93 9.96262 19.93 9.98598 19.9533 10.0327C19.9533 10.3598 19.9533 10.7103 19.9533 11.0374C19.9533 11.0607 19.93 11.1075 19.93 11.1308C19.93 11.3411 19.9066 11.5514 19.8833 11.7617C19.8365 12.0421 19.7898 12.3458 19.7431 12.6262C19.6496 13.1168 19.5094 13.6075 19.3225 14.0748C19.1356 14.5888 18.9019 15.0794 18.6216 15.5467C18.458 15.8505 18.2244 16.1776 17.9907 16.5047C17.8973 16.6449 17.7804 16.7617 17.687 16.9019C17.5702 17.0421 17.4533 17.1822 17.3132 17.3224C17.1029 17.5327 16.916 17.743 16.6823 17.9299C16.4954 18.0935 16.3085 18.2336 16.1216 18.3972C15.8646 18.6075 15.5842 18.7944 15.3038 18.9813C15.0935 19.1215 14.8599 19.2383 14.6496 19.3551C14.4861 19.4486 14.2991 19.5421 14.1122 19.6122C13.8552 19.729 13.5982 19.8224 13.3412 19.9159C12.9206 20.0561 12.5001 20.1729 12.0795 20.2664C11.8692 20.3131 11.659 20.3364 11.4487 20.3832C11.2618 20.4065 11.0982 20.4299 10.9113 20.4533C10.7244 20.4766 10.5608 20.4766 10.3739 20.5C10.3505 20.5 10.3038 20.5 10.2804 20.5234C10.0935 20.5234 9.92998 20.5234 9.74306 20.5234C9.7197 20.5234 9.69634 20.5 9.67297 20.5C9.55615 20.5 9.46269 20.4766 9.34587 20.4766C9.18232 20.4766 9.04213 20.4533 8.90194 20.4299C8.6683 20.4065 8.45802 20.3832 8.24774 20.3365C7.78045 20.243 7.31316 20.1262 6.86923 19.986C6.58886 19.8925 6.30848 19.7757 6.05148 19.6589C5.88792 19.5888 5.74774 19.5187 5.58419 19.4486C5.42063 19.3785 5.28045 19.285 5.14026 19.215C4.76643 19.0047 4.41596 18.771 4.06549 18.514C3.85521 18.3505 3.64493 18.1869 3.43465 18C3.29447 17.8832 3.15428 17.743 3.03746 17.6262C2.92063 17.5093 2.82718 17.4159 2.71035 17.2991C2.6169 17.2056 2.52344 17.1121 2.45334 17.0187C2.31316 16.8551 2.17297 16.6682 2.03278 16.4813C1.86923 16.271 1.72905 16.0607 1.58886 15.8505C1.47204 15.6636 1.35521 15.4533 1.23839 15.243C1.05148 14.8692 0.864559 14.4953 0.701008 14.0981C0.560821 13.7477 0.467363 13.4206 0.373905 13.0701C0.257082 12.6028 0.163624 12.1355 0.116895 11.6682C0.093531 11.5748 0.093531 11.4813 0.093531 11.3879C0.093531 11.271 0.0701665 11.1542 0.0701665 11.0374C0.0701665 10.9673 0.0701665 10.9206 0.046802 10.8505C0.046802 10.8271 0.046802 10.8037 0.0234375 10.8037C0.0234375 10.6168 0.0234375 10.4299 0.0234375 10.2664C0.0234375 10.243 0.046802 10.2196 0.046802 10.1963C0.0701665 10.0327 0.0701665 9.86916 0.093531 9.68224C0.093531 9.49533 0.116895 9.33178 0.14026 9.14486C0.186989 8.81776 0.257082 8.46729 0.327176 8.14019C0.420634 7.74299 0.537456 7.34579 0.701008 6.97196C0.771101 6.76168 0.864559 6.5514 0.958017 6.34112C1.0982 6.06075 1.21503 5.80374 1.37858 5.52336C1.56549 5.19626 1.79914 4.86916 2.00942 4.54206C2.17297 4.30841 2.35989 4.09813 2.5468 3.88785C2.66362 3.77103 2.78045 3.63084 2.89727 3.51402C3.06082 3.3271 3.24774 3.18692 3.43465 3.02336C3.64493 2.83645 3.85521 2.6729 4.06549 2.50935C4.29914 2.34579 4.53278 2.18224 4.76643 2.01869C4.97671 1.90187 5.16362 1.78505 5.37391 1.66822C5.63091 1.52804 5.91129 1.38785 6.19166 1.29439C6.44867 1.20093 6.70568 1.10748 6.93933 1.01402C7.07951 0.96729 7.2197 0.920561 7.35989 0.897196C7.68699 0.803738 8.01409 0.733645 8.3412 0.686916C8.55148 0.663551 8.73839 0.616822 8.94867 0.593458C9.08886 0.570093 9.25241 0.570093 9.41596 0.546729C9.41596 0.523364 9.43933 0.5 9.48605 0.5ZM8.52811 15.0093C8.57484 15.0327 8.62157 15.0327 8.6683 15.0327C9.67297 15.0327 10.6543 15.0327 11.659 15.0327C11.8225 15.0327 11.9861 15.0327 12.1496 15.0093C12.2898 14.986 12.43 14.986 12.5468 14.9626C12.8038 14.9159 13.0375 14.8692 13.2711 14.7991C13.5748 14.7056 13.8552 14.5654 14.1356 14.4252C14.416 14.2617 14.6963 14.0514 14.93 13.8178C15.0234 13.7243 15.0935 13.6308 15.187 13.5374C15.3038 13.3972 15.4206 13.257 15.5375 13.0935C15.6543 12.9065 15.7711 12.6963 15.8646 12.486C15.958 12.2757 16.0281 12.0421 16.0982 11.8084C16.1449 11.6449 16.1683 11.4813 16.1917 11.3178C16.1917 11.2009 16.215 11.0607 16.215 10.9439C16.215 10.7336 16.215 10.5 16.1917 10.2897C16.1683 10.0093 16.0982 9.72897 16.0047 9.4486C15.9347 9.19159 15.8178 8.95794 15.701 8.74766C15.5375 8.44393 15.3272 8.16355 15.0935 7.92991C15.0234 7.85981 14.93 7.76636 14.8599 7.69626C14.6963 7.55607 14.5328 7.43925 14.3692 7.34579C14.1356 7.20561 13.9019 7.08879 13.6449 6.99533C13.3646 6.8785 13.0608 6.80841 12.7571 6.76168C12.5234 6.71495 12.2664 6.69159 12.0328 6.69159C10.9347 6.69159 9.83652 6.69159 8.73839 6.69159C8.71503 6.69159 8.69166 6.69159 8.6683 6.69159C8.64493 6.69159 8.62157 6.69159 8.5982 6.71495C8.5982 6.73832 8.5982 6.73832 8.5982 6.76168C8.5982 9.49533 8.5982 12.229 8.5982 14.9626C8.52811 14.9626 8.52811 14.986 8.52811 15.0093ZM5.56082 6.69159C5.56082 6.76168 5.56082 6.80841 5.56082 6.85514C5.56082 9.51869 5.56082 12.2056 5.56082 14.8692C5.56082 14.8925 5.56082 14.9393 5.56082 14.9626C5.56082 14.986 5.56082 15.0093 5.58419 15.0327C5.60755 15.0327 5.63091 15.0327 5.65428 15.0327C5.98138 15.0327 6.33185 15.0327 6.65895 15.0327C6.68232 15.0327 6.70568 15.0327 6.72905 15.0327C6.75241 14.986 6.75241 14.9393 6.75241 14.8925C6.75241 12.229 6.75241 9.54206 6.75241 6.8785C6.75241 6.85514 6.75241 6.80841 6.75241 6.78505C6.75241 6.76168 6.75241 6.73832 6.72905 6.71495C6.70568 6.71495 6.68232 6.71495 6.65895 6.71495C6.33185 6.71495 6.00475 6.71495 5.67764 6.71495C5.63091 6.69159 5.60755 6.69159 5.56082 6.69159ZM6.14493 5.71028C6.51876 5.73364 6.93933 5.40654 6.93933 4.93925C6.93933 4.49533 6.61222 4.16822 6.14493 4.14486C5.70101 4.14486 5.37391 4.51869 5.37391 4.91589C5.37391 5.35981 5.74774 5.73364 6.14493 5.71028Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M9.71973 13.9348C9.71973 13.9114 9.71973 13.9114 9.71973 13.888C9.71973 13.8647 9.71973 13.8413 9.71973 13.8179C9.71973 11.8553 9.71973 9.86933 9.71973 7.90672C9.71973 7.85999 9.71973 7.81326 9.74309 7.76653C9.76646 7.76653 9.78982 7.76653 9.81318 7.74316C9.83655 7.74316 9.83655 7.74316 9.85991 7.74316C10.5375 7.74316 11.1917 7.74316 11.8693 7.74316C11.9627 7.74316 12.0562 7.74316 12.1496 7.76653C12.3599 7.78989 12.5702 7.83662 12.7805 7.88335C13.1309 7.97681 13.4814 8.117 13.7851 8.32728C14.2291 8.63101 14.5562 9.02821 14.7665 9.54223C14.8833 9.79924 14.9534 10.0796 14.9767 10.36C15.0235 10.5936 15.0235 10.8506 15.0001 11.1076C14.9767 11.3413 14.93 11.5516 14.8833 11.7852C14.7898 12.1123 14.6496 12.4161 14.4393 12.6964C14.2992 12.9067 14.1356 13.0936 13.9253 13.2572C13.5749 13.5376 13.1777 13.7478 12.7337 13.8413C12.5235 13.888 12.3365 13.9348 12.1263 13.9581C11.9861 13.9815 11.8693 13.9815 11.7291 13.9815C11.1216 13.9815 10.4908 13.9815 9.88328 13.9815C9.81318 13.9581 9.76646 13.9581 9.71973 13.9348Z"
                      fill="currentColor"
                    ></path>
                  </g>
                  <defs>
                    <clippath id="clip0_367_826">
                      <rect width="20" height="20" fill="white" transform="translate(0 0.5)"></rect>
                    </clippath>
                  </defs>
                </svg>
              </div>
              <div className="search-name">
                {/* <div className="search-text">Vitalik Buterin</div> */}
                <div className="search-text highlight">{props.credentials}</div>
              </div>
            </div>
            <SearchArrow />
          </div>

          <div className="search-diiv" onClick={() => props.searchWithService("github")}>
            <div className="search-int-div">
              <div className="search-icon code w-embed">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.31973 19.8417C7.20354 19.8417 7.1106 19.8417 6.99441 19.8417C6.9247 19.8196 6.87822 19.7975 6.80851 19.7533C6.41348 19.5987 5.99521 19.444 5.62341 19.2673C5.06572 19.0022 4.53126 18.6929 4.04328 18.3394C3.48559 17.9417 2.97437 17.4778 2.50962 16.9697C2.11459 16.5278 1.76603 16.086 1.46395 15.5999C1.09215 15.0255 0.790066 14.429 0.557694 13.7883C0.325321 13.1476 0.162661 12.4849 0.092949 11.8C0.0464745 11.6233 0.0232372 11.4465 0 11.2919C0 10.8058 0 10.3198 0 9.85586C0 9.81167 0.0232372 9.74539 0.0232372 9.70121C0.0697117 9.10471 0.185898 8.5303 0.348559 7.9559C0.557694 7.20475 0.883015 6.49779 1.30129 5.81292C1.78927 5.01759 2.34696 4.28853 3.04408 3.64785C3.76443 2.98507 4.57774 2.41067 5.48399 1.96882C6.69232 1.37232 7.97037 1.01884 9.31813 0.908375C10.1314 0.842097 10.9447 0.86419 11.758 0.974653C12.4319 1.06302 13.1058 1.23976 13.7564 1.46069C14.5 1.7258 15.2204 2.07928 15.8943 2.49904C16.6611 2.98507 17.3582 3.55948 17.9856 4.24435C18.7989 5.15014 19.4263 6.14431 19.8678 7.27103C20.2396 8.2431 20.4488 9.23727 20.472 10.2756C20.4952 10.7837 20.472 11.2919 20.4023 11.8C20.3558 12.2419 20.2629 12.6837 20.1467 13.1035C19.8214 14.2744 19.2869 15.3569 18.5433 16.329C17.9856 17.0801 17.3117 17.7429 16.5682 18.2952C15.7548 18.8917 14.8951 19.3557 13.9423 19.7091C13.7797 19.7754 13.6403 19.8196 13.4776 19.8859C13.3614 19.8859 13.2685 19.8859 13.1523 19.8859C12.8734 19.7975 12.7805 19.5987 12.7572 19.3557C12.7572 19.2894 12.7572 19.2231 12.7572 19.1568C12.7572 18.4499 12.7572 17.7208 12.7572 17.0138C12.7572 16.7929 12.7572 16.5499 12.734 16.329C12.6875 15.8429 12.5249 15.379 12.1531 15.0034C12.1298 14.9813 12.1066 14.9592 12.0834 14.915C12.2693 14.893 12.4552 14.8488 12.6178 14.8267C13.3382 14.7383 14.0121 14.5395 14.6627 14.186C15.4992 13.7441 16.0569 13.1035 16.3823 12.2639C16.5449 11.8 16.6611 11.3361 16.7076 10.85C16.754 10.4303 16.754 10.0105 16.7076 9.59075C16.6146 8.86169 16.3358 8.2431 15.8478 7.69079C15.8013 7.62451 15.7548 7.58032 15.7084 7.51405C16.1034 6.51988 15.8478 5.43735 15.5689 4.92922C15.476 4.92922 15.3831 4.90713 15.2901 4.90713C14.988 4.90713 14.7092 4.9955 14.4536 5.10596C13.9191 5.30479 13.4311 5.54781 12.9431 5.85711C12.8502 5.92338 12.7572 5.94548 12.6411 5.90129C12.0137 5.74664 11.3862 5.65827 10.7356 5.61409C10.1314 5.5699 9.50403 5.61409 8.89986 5.68036C8.5513 5.72455 8.20275 5.81292 7.85419 5.8792C7.738 5.90129 7.64505 5.90129 7.52887 5.83501C7.27326 5.68037 7.04088 5.54781 6.76204 5.41525C6.32053 5.21642 5.87902 5.01759 5.41428 4.92922C5.22838 4.88503 5.04248 4.88503 4.85658 4.92922C4.50802 5.74664 4.41508 6.58616 4.76363 7.46986C4.69392 7.53614 4.62421 7.62451 4.57774 7.69079C4.06652 8.28729 3.78767 8.99425 3.7412 9.76749C3.71796 10.121 3.7412 10.4524 3.76443 10.8058C3.78767 11.3361 3.92709 11.8221 4.11299 12.3081C4.41508 13.0593 4.90306 13.6558 5.64665 14.0755C6.32053 14.4511 7.04088 14.672 7.80771 14.7825C7.99361 14.8046 8.17951 14.8267 8.38864 14.8709C8.34217 14.9371 8.29569 14.9813 8.24922 15.0255C8.20275 15.0918 8.13303 15.1581 8.08656 15.2243C7.9239 15.4674 7.80771 15.7325 7.76124 16.0197C7.738 16.1301 7.69153 16.1964 7.5521 16.2406C7.29649 16.329 7.04088 16.3953 6.78527 16.4173C6.5529 16.4394 6.29729 16.4394 6.06492 16.3953C5.64665 16.329 5.29809 16.086 5.01924 15.7767C4.87982 15.5999 4.78687 15.4232 4.64745 15.2464C4.29889 14.7825 3.85738 14.4953 3.25321 14.3848C3.11379 14.3627 2.95113 14.3627 2.81171 14.429C2.69552 14.4732 2.69552 14.5174 2.74199 14.6278C2.83494 14.7825 2.97437 14.893 3.11379 14.9813C3.34616 15.1139 3.53206 15.2906 3.69472 15.4895C3.92709 15.7767 4.08975 16.108 4.22918 16.4394C4.48479 17.058 4.99601 17.3894 5.64665 17.522C6.25082 17.6324 6.87822 17.6545 7.48239 17.5441C7.52887 17.5441 7.57534 17.5441 7.62181 17.522C7.62181 17.5882 7.64505 17.6545 7.64505 17.7208C7.64505 18.2289 7.64505 18.7371 7.66829 19.2452C7.71476 19.5324 7.59858 19.7533 7.31973 19.8417Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <div className="search-name">
                {/* <div className="search-text">Vitalik Buterin</div> */}
                <div className="search-text highlight">{props.credentials}</div>
              </div>
            </div>
            <SearchArrow />
          </div>
        </>
      ) : null}
    </div>
  );
};

export const SearchBar = () => {
  let navigate = useNavigate();
  let params = useParams();
  let [credentials, setCredentials] = useState("");
  // const [web2Service, setWeb2Service] = useState(params.web2service || 'ORCID') // Needn't be ORCID -- any web2service is fine. But this does feel hacky)
  const searchWithService = (service) => {
    // Parse credential, ensuring sure it's the right format (i.e., add/remove @ or @gmail.com when appropriate)
    let creds = credentials;
    // Sometimes gmail addresses have custom domain names, but @gmail should be default
    if (service == "Google" && !creds.includes("@")) {
      creds += "@gmail.com";
      // Twitter handles don't actually start with @ on the low level
    } else if (service == "twitter" && creds.startsWith("@")) {
      creds = creds.substring(1);
    }
    setCredentials(""); //reset credentials
    navigate(`/lookup/${service}/${creds || "nobody"}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let searchStr = event.target[0].value;
    navigate(`/lookup/holosearch/${searchStr}`);
  };

  return (
    <>
      <div className="optin-form w-form">
        {/* <form onSubmit={handleSubmit} id="email-form" name="email-form" data-name="Email Form" method="get" className="form"> */}
        <form onSubmit={handleSubmit} method="get" className="form">
          {
            credentials ? (
              <SearchWithSuggestions
                credentials={credentials}
                onChange={(e) => setCredentials(e.target.value)}
                searchWithService={searchWithService}
              />
            ) : (
              <SearchWithSuggestions credentials={credentials} onChange={(e) => setCredentials(e.target.value)} />
            )
            // <EmptySearch onChange={e=>setCredentials(e.target.value)}/>
          }
        </form>
      </div>
      {/* <div className="spacer-small"></div>
        <div className="btn-wrapper">
          <a onClick={search} className="x-button w-button">search now</a>
          <div className="v-spacer-small"></div>
          <div className="spacer-small mobile"></div>
          <a href="#" className="x-button secondary outline w-button">learn more</a>
        </div> */}
    </>
  );
};

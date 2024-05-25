import React , {useState, useEffect} from 'react'
import SearchBar from './SearchBar'
// import CheckBox from './CheckBox'
import './Main.css'
import AI3_data from './data/AI3.json'
//import Namelist from './Namelist'


const Main = () => {
    const [data, setData] = useState([]);
    // const [check, setCheck] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [checkedData, setCheckedData] = useState([])

useEffect(() => { setData(AI3_data) }, [])


const handleChange = (croll) => {

    setIsChecked(!isChecked);
    if (checkedData.includes(data[croll-1])) {
      // If already checked, remove from checkedTexts
      setCheckedData(checkedData.filter(x => x !== data[croll-1]));
    } else {
      // If not checked, add to checkedTexts
      setCheckedData([...checkedData, data[croll-1]]);
    }
  };



return (
      <>
        <div className='main-container'>
            <div className="search-container">
                <SearchBar/>
            </div>

            <div className="data-container">
                {
                    data.map((student) => (
                        <div className={isChecked ? "checkbox cb-active":"checkbox"} id={student.u_roll}  >
                            <input 
                                type="checkbox"
                               
                                onChange={()=>handleChange(student.c_roll)}
                            />
                            <label htmlFor={student.u_roll}>{student.c_roll}. {student.name}</label>
                        </div>

                    ))
                    // data.map( (student) =>
                    //     <CheckBox key={student.s_no} name={student.name}  c_roll={student.c_roll} u_roll={student.u_roll}   />
                    // )
                }
            </div>

            <button onClick={() => console.log(checkedData)}>Print Checked Texts</button>

            {/* <div>
                <Namelist list={nameList}/>
            </div> */}
        </div>
      
      </>
)}

export default Main
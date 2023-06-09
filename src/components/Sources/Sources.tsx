import React, {useEffect, useState} from 'react';
import fetchData from "commonUse/functions/fetchData";
import Loader from "components/Loader/Loader";
import {setSource} from "./sourceSlice";
import {useAppDispatch, useAppSelector} from "hooks";
import {setArticles} from "components/Feed/articlesSlice";

function Sources() {
  const dispatch = useAppDispatch()
  const input = useAppSelector((state) => state.input.value)

  const [sourceList, setSourceList] = useState([{
    name: 'No sources',
    id: ''
  }])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSources = () => {
      // in case API don't answer because there was too many requests, second key:
      // 7705af18e3f24e069b4d57ab8b5a577a
      fetch(`https://newsapi.org/v2/top-headlines/sources?language=en&apiKey=4c32a79d7abc4e96bd76e397eb2297da`)
        .then((res) => res.json()).then(json => {
          setSourceList(json.sources)
      })
        .catch((e) => {
          console.log(e)
          setSourceList(sourceList)
        })
    }

    getSources()
  }, [])

  return (
    <div className="mt-4">
      <p className="text-black font-black"
      >Filter news by source:</p>
      <select
        className="mt-2 font-bold text-violet-500 w-full border-2 border-gray-200 hover:border-gray-300 focus:outline-none font-medium rounded-lg text-sm px-4 py-1 text-left inline-flex items-center"
        defaultValue={'no'}
        onChange={(event) => {
          dispatch(setSource(event.target.value))
          fetchData(input, event.target.value, setLoading).then((data) => dispatch(setArticles(data)))
        }
      }
      >
        <option
          className="text-left font-bold"
          value={'no'} key={'no'}>Any source</option>
        {
          sourceList?.map(
            (o) => <option className="text-left font-bold" value={o.id} key={o.id}>{o.name}</option>
          )
        }
      </select>
      {loading && <Loader />}
    </div>
  );
}

export default Sources;

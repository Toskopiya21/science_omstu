
import React, { useState } from "react";
import { FilterAPI, PublicationsAPI } from "../../../store/api";
import { useDispatch, useSelector } from "react-redux";
import { getPublicationType, getSourceRatingTypes, getDepartments } from "../../../store/slices/FilterSlices";
import { useForm } from "react-hook-form";
import { fetchAuthorSearch } from "../../../store/slices/AuthorsSlice";
import { useDebounce } from "use-debounce";
import { fetchPublicationsSearch, setFilter } from "../../../store/slices/PublicationsSlice";
import style from './PublicationFilter.module.css'

const PublicationFilter = () => {
    const [whList, setwhiteList] = useState('false');
    const [validWac, setvalidWac] = useState('false');
    const { register, formState: { errors }, handleSubmit } = useForm();

    const dispatch = useDispatch();
    const { publicationType, sourceRatingTypes, departments } = useSelector(state => state.filter)
    const [search, setSearch] = useState('');
    const { authors, count } = useSelector(state => state.authors);
    const debouncedSearch = useDebounce(search, 500);
    const { publications, pageSize } = useSelector(state => state.publications);
    let date = new Date().toLocaleDateString('en-ca')
    const state = {
        button: 1
    };

    const [selectedFilters, setSelectedFilters] = useState([]);
    function handleOnSubmit(event) {
        event.preventDefault();
        // здесь ваш код обработки onSubmit
        setSelectedFilters(previousFilters => [...previousFilters, ...selectedFilters]);
    }
    console.log(selectedFilters)

    const [wacRating, setWacRating] = useState({
        K1: false,
        K2: false,
        K3: false,
        noСategory: false,
    });
    console.log(wacRating)

    const handleWacRatingChange = (e) => {
        setWacRating({
            ...wacRating,
            [e.target.name]: e.target.checked,
        });
    };

    const [whiteList, setWhiteList] = useState({
        WhiteListIN: false,
        WhiteListNoIN: false,
    });
    console.log(whiteList)
    console.log(register)

    const handleWhiteListChange = (e) => {
        setWhiteList({
            ...whiteList,
            [e.target.name]: e.target.checked,
        });
    };
    const onSearchChange = (e) => {
        const { value } = e.target
        setSearch(value)
    }
    const handleOptionChange = (e) => {
        console.log("зашел")
        console.log(e.target.value)
        console.log(e.target)
        console.log(e)

        if (e.target.value == "ВАК \"Список журналов\"") {
            setvalidWac(true)
            console.log("вак")
        }
        else setvalidWac(false)

        if (e.target.value == "Белый список") {
            setwhiteList(true)
            console.log("белый список")
        }
        else setwhiteList(false)
        
    }

    React.useEffect(() => {
        const getType = async () => {
            const res = await FilterAPI.getPublicationType();
            dispatch(getPublicationType(res.data.publication_types))
        }
        const getSourceRating = async () => {
            const res = await FilterAPI.getSourceRatingTypes();
            dispatch(getSourceRatingTypes(res.data.source_rating_types))
        }
        const getAllDepartments = async () => {
            const res = await FilterAPI.getDepartments();
            dispatch(getDepartments(res.data.departments))
        }

        getType();
        getSourceRating();
        getAllDepartments();

    }, [])

    React.useEffect(() => {
        try {
            dispatch(fetchAuthorSearch({ search, page: 0, pageSize: count }))
        } catch (e) {
            console.log(e);
        }
    }, [debouncedSearch[0]])

    const onSubmit = (data) => {
        console.log(data)
        if (data.publicationType === '') {
            data.publicationType = null
        }
        if (data.authorName === '') {
            data.authorName = null
        }
        if (data.SourceRating === '') {
            data.SourceRating = null
        }
        if (data.department === '') {
            data.department = null
        }
        if (data.beforeTime === '') {
            data.beforeTime = `1960-06-12`
        }
        if (data.afterTime === '') {
            data.afterTime = date
        }
        dispatch(setFilter(data))

        const sendFilters = async () => {
            try {
                dispatch(fetchPublicationsSearch({
                    search: null, publication_type_id: data.publicationType,
                    author_id: data.authorName, source_rating_type_id: data.SourceRating, department: data.department,
                    from_date: data.beforeTime,
                    to_date: data.afterTime, page: 0, pageSize
                }));
            } catch (e) {
                console.log(e)
            }
        }
        if (state.button === 1)
            sendFilters();
        if (state.button === 2) {
            try {
                let url = '/api/publication/excel?';
                if (data.publicationType)
                    url += `publication_type_id=${data.publicationType}&`
                if (data.authorName)
                    url += `author_id=${data.authorName}&`
                if (data.SourceRating)
                    url += `source_rating_type_id=${data.SourceRating}&`
                if (data.department)
                    url += `department_id=${data.department}&`
                if (data.beforeTime)
                    url += `from_date=${data.beforeTime}&`
                if (data.afterTime)
                    url += `to_date=${data.afterTime}&`
                url += `limit=1000`
                fetch(url).then(res => {
                    return res.blob();
                }).then(blob => {
                    const href = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.download = 'output.xlsx';
                    a.href = href;
                    a.click();
                    a.href = '';
                })
            }
            catch (e) {
                console.log(e)
            }
        }
    }


    return <div className={style.filter}>
        <div>Фильтры</div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="time">Период времени</label>
                    <div>
                        От: <input className={style.date} {...register("beforeTime")} type={"date"} />
                    </div>
                    <div>
                        До: <input className={style.date} {...register("afterTime")} type={"date"} />
                    </div>
                </div>
                <div>
                    <label htmlFor="publicationType">Тип публикации: </label>
                    <select className={style.dataName} {...register("publicationType")}>
                        <option>{null}</option>
                        {publicationType.map((type, index) =>
                            <option key={index} value={type.id}>{type.name}</option>
                        )}
                    </select>
                </div>
                <div>
                {/* onChange={handleOptionChange} */}
                    <label htmlFor="SourceRating">Рейтинг:</label>
                    <select className={style.dataName} {...register("SourceRating")} onChange = {handleOptionChange}>
                        <option>{null}</option>
                        {sourceRatingTypes.map((type, index) =>
                            <option key={index} value={type.name}>{type.name}</option>
                            // <option key={index} value={type.id}>{type.name}</option>
                        )}
                    </select>
                </div>
                {/* {whList == true && */}
                {true &&
                    <div>
                        <label>"Белый список" РЦНИ</label>
                        <label>
                            <input
                                type="checkbox"
                                name="WhiteListIN"
                                checked={whiteList.WhiteListIN}
                                onChange={handleWhiteListChange}
                            />
                            Входит
                        </label>
                        <br />
                        <label>
                            <input
                                type="checkbox"
                                name="WhiteListNoIN"
                                checked={whiteList.WhiteListNoIN}
                                onChange={handleWhiteListChange}
                            />
                            Не входит
                        </label>
                    </div>
                }

                {validWac == true &&
                // {true &&
                    <div>
                        <label>ВАК категории</label>
                        <br />
                        <label>
                            <input
                                type="checkbox"
                                name="K1"
                                checked={wacRating.K1}
                                onChange={handleWacRatingChange}
                            />
                            К1
                        </label>
                        <br /> 
                        <label>
                            <input
                                type="checkbox"
                                name="K2"
                                checked={wacRating.K2}
                                onChange={handleWacRatingChange}
                            />
                            К2
                        </label>
                        <br />
                        <label>
                            <input
                                type="checkbox"
                                name="K3"
                                checked={wacRating.K3}
                                onChange={handleWacRatingChange}
                            />
                            К3
                        </label>
                        <br />
                        <label>
                            <input
                                type="checkbox"
                                name="noСategory"
                                checked={wacRating.noСategory}
                                onChange={handleWacRatingChange}
                            />
                            Без категории
                        </label>
                        <br /> 
                    </div>
                }
                <div>
                    <label htmlFor="department">Кафедра:</label>
                    <select className={style.dataName} {...register("department")}>
                        <option>{null}</option>
                        {departments.map((type, index) => {
                            if (type.name !== '') {
                                return <option key={index} value={type.id}>{type.name}</option>
                            }
                        }
                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="authorName">Автор:</label>
                    <input className={style.dataName} list="authorName" placeholder={"Введите имя автора"} type="search" value={search}
                        onChange={onSearchChange} />
                    <select className={style.dataName} id="authorName" {...register("authorName")}>
                        <option>{null}</option>
                        {authors.map((author, index) =>
                            <option value={author.id} key={index}>
                                {author.surname} {author.name} {author.patronymic}
                            </option>
                        )}
                    </select>
                </div>
                <div>
                    <input className={style.dataName} type={"submit"} value={"Применить"} onClick={() => (state.button = 1)} />
                </div>
                <div>
                    <input className={style.dataName} type={"submit"} value={"Скачать в Excel"} onClick={() => (state.button = 2)} />
                </div>
            </form>
        </div>
    </div>
}

export default PublicationFilter;


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
    // let rwhList = useRef();

    const [validWac, setvalidWac] = useState('false');
    // let rvalidWac = useRef();

    const [wacRating, setWacRating] = useState({
        K1: false,
        K2: false,
        K3: false,
        noСategory: false,
    });
    const [whiteList, setWhiteList] = useState({
        whiteListIN: false,
        whiteListNotIN: false,
    });
    const handleOptionChange = (e) => {
        if (e.target.value == 4) { // 4 - Journal Citation Reports WoS | ВАК категория
            setvalidWac(true)
            console.log("вак")
        }
        else setvalidWac(false)

        if (e.target.value == 3) { // 3 - белый список
            setwhiteList(true)
            console.log("белый список")
        }
        else setwhiteList(false)

    }
    const handleWacRatingChange = (e) => {
            setWacRating({
                ...wacRating,
                [e.target.name]: e.target.checked,
            });
    };
    const handleWhiteListChange = (e) => {
        setWhiteList({
            ...whiteList,
            [e.target.name]: e.target.checked,
        });
    };

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

    const onSearchChange = (e) => {
        const { value } = e.target
        setSearch(value)
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
        console.log(data);
        
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
        if (data.noСategory === "") {
            data.noСategory = null
        }
        if (data.K1 === undefined) {
            data.K1 = null
        }
        if (data.K2 === undefined) {
            data.K2 = null
        }
        if (data.K3 === undefined) {
            data.K3 = null
        }
        if (data.whiteListIN === undefined) {
            data.whiteListIN = null
        }
        if (data.whiteListNotIN === undefined) {
            data.whiteListNotIN = null
        }
        dispatch(setFilter(data))

        const sendFilters = async () => {
            try {
                dispatch(fetchPublicationsSearch({
                    search: null, publication_type_id: data.publicationType,
                    author_id: data.authorName, source_rating_type_id: data.SourceRating, department: data.department,
                    from_date: data.beforeTime,
                    to_date: data.afterTime, page: 0, pageSize,

                    vac_caregory_k1: data.K1, vac_caregory_k2: data.K2, vac_caregory_k3: data.K3, vac_no_caregory: data.noСategory,
                    white_list_in: data.whiteListIN, white_list_not_in: data.whiteListNotIN
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
                
                if (data.K1)
                    url += `vac_caregory_k1=${data.K1}&`
                if (data.K2)
                    url += `vac_caregory_k2=${data.K2}&`
                if (data.K3)
                    url += `vac_caregory_k3=${data.K3}&`
                if (data.noСategor)
                    url += `vac_no_caregory=${data.noСategory}&`
                if (data.whiteListIN)
                    url += `white_list_in=${data.whiteListIN}`
                if (data.whiteListNotIN)
                    url += `white_list_not_in=${data.whiteListNotIN}&`
                
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
                <div 
                    // {...register("whiteListIN")} {...register("whiteListNotIN")}
                    // {...register("K1")}{...register("K2")}
                    // {...register("K3")}{...register("noСategory")}
                    >
                    <label htmlFor="SourceRating">Рейтинг:</label>
                    <select className={style.dataName} {...register("SourceRating")} onChange={handleOptionChange}>
                        <option>{null}</option>
                        {sourceRatingTypes.map((type, index) =>
                            <option key={index} value={type.id} id={type.name}>{type.name}</option>
                        )}
                    </select>
                </div>
                        {whList == true &&
                            <div>
                        
                                <label htmlFor="whiteListCategory">Белый список</label>
                                <br />
        
                                <label>
                                    <input
                                        {...register("whiteListIN")}
                                        type="checkbox"
                                        name="whiteListIN"
                                        checked={whiteList.whiteListIN}
                                        onChange={handleWhiteListChange}

                                    />
                                    Входит
                                </label>
                                <br />
                                <label>
                                    <input
                                        {...register("whiteListNotIN")}
                                        type="checkbox"
                                        name="whiteListNotIN"
                                        checked={whiteList.whiteListNotIN}
                                        onChange={handleWhiteListChange} />
                                        Не входит
                                </label>
                            </div>
                        }
        
                        {validWac == true &&
                            <div>
                                <label htmlFor="vacCategory">ВАК категории</label>
                                <br />
                                <label>
                                    <input
                                        {...register("K1")}
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
                                        {...register("K2")}
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
                                        {...register("K3")}
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
                                        {...register("noСategory")}
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

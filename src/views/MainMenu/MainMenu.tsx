import './MainMenu.style.css'
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import useMainMenuViewModel from "../../viewmodels/MainMenu/MainMenu";
import CreateDBModal from "./CreateDBModal/CreateDBModal";
function MainMenu() {
    const {
        dbs,
        createDbOpenned,
        onCreateDbOpen,
        onCreateDbClose,
        onSubmitDb
    } = useMainMenuViewModel()

    return (
        <>
            {
                createDbOpenned
                ? <CreateDBModal onSubmitDb={onSubmitDb} onClose={onCreateDbClose}/>
                : null
            }
            <div className="main-menu">
                <h2 className="main-menu__header">Главное меню</h2>
                <div className="main-menu__controls">
                    <button onClick={onCreateDbOpen}>Создать БД</button>
                    <button>Открыть существующую БД</button>
                </div>
                <div className="main-menu__recent">
                    <h3>Прошлые проекты</h3>
                    {
                        dbs.length
                            ? dbs.map((db) => {
                            return <div className="recent-db">
                                <div className="recent-db__name">{db.name}</div>
                                <div className="recent-db__type">{db.type}</div>
                                <div className="recent-db__create-date">{db.createDate.toJSON()}</div>
                            </div>
                        })
                            : <div className="recent-db__empty">Нет прошлых проектов</div>
                    }
                </div>
            </div>
        </>
    )
}

export default MainMenu
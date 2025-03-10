.app-wrapper {
    background-color: var(--color-background);
    padding-top: 12px;
    font-size: 18px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    min-height: 100vh;
}

.main {
    min-height: 1px;
}

.app-wrapper__container{
    min-width: 390px;
    margin: 0 auto;
    max-width: 1200px;
    display: grid;
    grid-template-areas:
            'header' 'content' 'footer';
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
}

.app-wrapper-content {
    grid-area: content;
}

@media (max-width: 1201px) {
.app-wrapper__container{
    margin-left: 10px;
    margin-right: 10px;
}
}


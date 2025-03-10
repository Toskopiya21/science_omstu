from typing import List

from pydantic import BaseModel

from src.schemas.schemas import SchemePublication, SchemePublicationPage, SchemeAuthor, \
    SchemeAuthorProfile, SchemeSourceWithType, SchemeSourceWithRating, SchemeFeedback, SchemeFeedbackOutput, \
    SchemeAnalysis, SchemeAnalysisRating, SchemeAnalysisOrganization, SchemePublicationType


class SchemePublicationsRouter(BaseModel):
    publications: List[SchemePublication]
    count: int


class SchemePublicationRouter(BaseModel):
    publication: SchemePublicationPage


class SchemeAuthorsRouter(BaseModel):
    authors: List[SchemeAuthor]
    count: int


class SchemeAuthorRouter(BaseModel):
    author: SchemeAuthorProfile


class SchemeSourcesRouter(BaseModel):
    sources: List[SchemeSourceWithType]
    count: int


class SchemeSourceRouter(BaseModel):
    source: SchemeSourceWithRating


class SchemeFeedbackPostRouter(BaseModel):
    feedback: SchemeFeedback
    token: str


class SchemeFeedbacksGetRouter(BaseModel):
    feedbacks: List[SchemeFeedbackOutput]
    count: int


class SchemeAnalysisRouter(BaseModel):
    result: List[SchemeAnalysis]
    total: int


class SchemeAnalysisRatingRouter(BaseModel):
    result: List[SchemeAnalysisRating]


class SchemeAnalysisOrganizationRouter(BaseModel):
    result: List[SchemeAnalysisOrganization]


class SchemePublicationTypesRouter(BaseModel):
    publication_types: List[SchemePublicationType]

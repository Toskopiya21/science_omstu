"""add nioktr7

Revision ID: 04c698cecdcc
Revises: 71257533d2d8
Create Date: 2023-09-19 14:15:35.487926

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '04c698cecdcc'
down_revision: Union[str, None] = '71257533d2d8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('organization_type',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('subject_type',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('nioktr',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('work_supervisor_id', sa.Integer(), nullable=False),
    sa.Column('organization_supervisor_id', sa.Integer(), nullable=False),
    sa.Column('organization_executor_id', sa.Integer(), nullable=False),
    sa.Column('rosrid_id', sa.String(), nullable=True),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('annotation', sa.String(), nullable=True),
    sa.Column('created_date', sa.Date(), nullable=False),
    sa.Column('document_date', sa.Date(), nullable=False),
    sa.Column('work_start_date', sa.Date(), nullable=False),
    sa.Column('work_end_date', sa.Date(), nullable=False),
    sa.Column('contract_number', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['organization_executor_id'], ['organization.id'], ),
    sa.ForeignKeyConstraint(['organization_supervisor_id'], ['author.id'], ),
    sa.ForeignKeyConstraint(['work_supervisor_id'], ['author.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('nioktr_budget',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('funds', sa.Integer(), nullable=False),
    sa.Column('kbk', sa.String(), nullable=False),
    sa.Column('budget_type_id', sa.Integer(), nullable=False),
    sa.Column('nioktr_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['budget_type_id'], ['budget_type.id'], ),
    sa.ForeignKeyConstraint(['nioktr_id'], ['nioktr.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('nioktr_critical_tech',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nioktr_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['nioktr_id'], ['nioktr.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('nioktr_priority_directions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nioktr_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['nioktr_id'], ['nioktr.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('nioktr_types',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('nioktr_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['nioktr_id'], ['nioktr.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_column('budget_type', 'kbk')
    op.drop_column('budget_type', 'funds')
    op.create_foreign_key(None, 'keywords_nioktr', 'nioktr', ['nioktr_id'], ['id'])
    op.add_column('organization', sa.Column('organization_type_id', sa.Integer()))
    op.create_foreign_key(None, 'organization', 'organization_type', ['organization_type_id'], ['id'])
    op.add_column('subject', sa.Column('subject_type_id', sa.Integer()))
    op.create_foreign_key(None, 'subject', 'subject_type', ['subject_type_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'subject', type_='foreignkey')
    op.drop_column('subject', 'subject_type_id')
    op.drop_constraint(None, 'organization', type_='foreignkey')
    op.drop_column('organization', 'organization_type_id')
    op.drop_constraint(None, 'keywords_nioktr', type_='foreignkey')
    op.add_column('budget_type', sa.Column('funds', sa.INTEGER(), autoincrement=False, nullable=False))
    op.add_column('budget_type', sa.Column('kbk', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.drop_table('nioktr_types')
    op.drop_table('nioktr_priority_directions')
    op.drop_table('nioktr_critical_tech')
    op.drop_table('nioktr_budget')
    op.drop_table('nioktr')
    op.drop_table('subject_type')
    op.drop_table('organization_type')
    # ### end Alembic commands ###

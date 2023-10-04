"""add nioktr8

Revision ID: 4189461836d7
Revises: 04c698cecdcc
Create Date: 2023-09-19 17:09:43.071899

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4189461836d7'
down_revision: Union[str, None] = '04c698cecdcc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('critical_tech',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('priority_directions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('types_n',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('organization_identifier',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('organization_id', sa.Integer(), nullable=False),
    sa.Column('identifier_id', sa.Integer(), nullable=False),
    sa.Column('identifier_value', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['identifier_id'], ['identifier.id'], ),
    sa.ForeignKeyConstraint(['organization_id'], ['organization.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('budget_type', sa.Column('name', sa.String(), nullable=True))
    op.add_column('nioktr_critical_tech', sa.Column('critical_tech_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'nioktr_critical_tech', 'critical_tech', ['critical_tech_id'], ['id'])
    op.drop_column('nioktr_critical_tech', 'name')
    op.add_column('nioktr_priority_directions', sa.Column('priority_directions_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'nioktr_priority_directions', 'priority_directions', ['priority_directions_id'], ['id'])
    op.drop_column('nioktr_priority_directions', 'name')
    op.add_column('nioktr_types', sa.Column('types_n_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'nioktr_types', 'types_n', ['types_n_id'], ['id'])
    op.drop_column('nioktr_types', 'name')
    op.drop_column('organization', 'organization_type_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('organization', sa.Column('organization_type_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key('organization_organization_type_id_fkey', 'organization', 'organization_type', ['organization_type_id'], ['id'])
    op.add_column('nioktr_types', sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'nioktr_types', type_='foreignkey')
    op.drop_column('nioktr_types', 'types_n_id')
    op.add_column('nioktr_priority_directions', sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'nioktr_priority_directions', type_='foreignkey')
    op.drop_column('nioktr_priority_directions', 'priority_directions_id')
    op.add_column('nioktr_critical_tech', sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'nioktr_critical_tech', type_='foreignkey')
    op.drop_column('nioktr_critical_tech', 'critical_tech_id')
    op.drop_column('budget_type', 'name')
    op.create_table('organization_type',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='organization_type_pkey'),
    sa.UniqueConstraint('name', name='organization_type_name_key')
    )
    op.drop_table('organization_identifier')
    op.drop_table('types_n')
    op.drop_table('priority_directions')
    op.drop_table('critical_tech')
    # ### end Alembic commands ###
